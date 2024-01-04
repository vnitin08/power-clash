import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
} from '@proto-kit/module';
import { State, StateMap } from '@proto-kit/protocol';
import { Experimental, Field, UInt64, Bool, SelfProof } from 'o1js';
import {
    Bricks,
    GameInputs,
    GameProcessPublicOutput,
    GameRecordKey,
    GameRecordPublicOutput,
} from './types';

import { GameContext, loadGameContext } from './GameContext';
import { assert } from 'console';

export function checkMapGeneration(seed: Field, bricks: Bricks): GameContext {
    return loadGameContext(bricks, Bool(false));
}

export const MapGeneration = Experimental.ZkProgram({
    publicInput: Field,
    publicOutput: GameContext,
    methods: {
        checkMapGeneration: {
            privateInputs: [Bricks],
            method: checkMapGeneration,
        },
    },
});

export class MapGenerationProof extends Experimental.ZkProgram.Proof(
    MapGeneration
) {}

export const GameProcess = Experimental.ZkProgram({
    publicOutput: GameProcessPublicOutput,
    methods: {
        init: {
            privateInputs: [GameContext],
            method(initial: GameContext): GameProcessPublicOutput {
                return new GameProcessPublicOutput({
                    initialState: initial,
                    currentState: initial,
                });
            },
        },

        processTicks: {
            privateInputs: [SelfProof, GameInputs],

            method(
                prevProof: SelfProof<void, GameProcessPublicOutput>,
                inputs: GameInputs
            ): GameProcessPublicOutput {
                return prevProof.publicOutput;
            },
        },
    },
});

export class GameProcessProof extends Experimental.ZkProgram.Proof(
    GameProcess
) {}

export function checkGameRecord(
    mapGenerationProof: MapGenerationProof,
    gameProcessProof: GameProcessProof
): GameRecordPublicOutput {
    // Verify map generation
    mapGenerationProof.verify();

    // Check if map generation output equal game process initial state
    mapGenerationProof.publicOutput
        .equals(gameProcessProof.publicOutput.initialState)
        .assertTrue();

    // Verify game process
    gameProcessProof.verify();

    // Check if game is won
    gameProcessProof.publicOutput.currentState.alreadyWon.assertTrue();

    // Get score
    return new GameRecordPublicOutput({
        score: gameProcessProof.publicOutput.currentState.score,
    });
}

export const GameRecord = Experimental.ZkProgram({
    publicOutput: GameRecordPublicOutput,
    methods: {
        checkGameRecord: {
            privateInputs: [MapGenerationProof, GameProcessProof],
            method: checkGameRecord,
        },
    },
});

export class GameRecordProof extends Experimental.ZkProgram.Proof(GameRecord) {}

@runtimeModule()
export class GameHub extends RuntimeModule<unknown> {
    /// Seed + User => Record
    @state() public gameRecords = StateMap.from<GameRecordKey, UInt64>(
        GameRecordKey,
        UInt64
    );
    @state() public seeds = StateMap.from<UInt64, UInt64>(UInt64, UInt64);
    @state() public lastSeed = State.from<UInt64>(UInt64);
    @state() public lastUpdate = State.from<UInt64>(UInt64);

    @runtimeMethod()
    public updateSeed(seed: UInt64): void {
        const lastSeedIndex = this.lastSeed.get().orElse(UInt64.from(0));
        this.seeds.set(lastSeedIndex, seed);
        this.lastSeed.set(lastSeedIndex.add(1));
    }

    @runtimeMethod()
    public addGameResult(gameRecordProof: GameRecordProof): void {
        gameRecordProof.verify();

        const gameKey = new GameRecordKey({
            seed: this.seeds.get(this.lastSeed.get().value).value,
            player: this.transaction.sender,
        });

        const currentScore = this.gameRecords.get(gameKey).value;
        const newScore = gameRecordProof.publicOutput.score;

        if (currentScore < newScore) {
            this.gameRecords.set(gameKey, newScore);
        }
    }
}
