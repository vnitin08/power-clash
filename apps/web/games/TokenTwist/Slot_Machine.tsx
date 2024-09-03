import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Field, PublicKey } from 'o1js';
import { UInt64 } from '@proto-kit/library';
import { useNetworkStore } from '@/lib/stores/network';
import { ClientAppChain, SlotMachine } from 'zknoid-chain-dev';
import GamePage from '@/components/framework/GamePage';
import { tokenTwistConfig } from './config';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import CoverSVG from './assets/game-cover.svg';
import { DEFAULT_PARTICIPATION_FEE } from 'zknoid-chain-dev/dist/src/engine/LobbyManager';
import { motion } from 'framer-motion';
import Button from '@/components/shared/Button';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import Rules from './components/Rules';
import HowToPlay from './components/HowToPlay';
import BetControl from './components/BetControl';

const SYMBOLS = ['🍌', '7️⃣', '🍒', '🍑'];
const ICON_HEIGHT = 100;
const NUM_ICONS = SYMBOLS.length;
const TIME_PER_ICON = 100;

interface ReelProps {
  spinning: boolean;
  finalSymbol?: number;
  onSpinComplete: () => void;
}

const Reel: React.FC<ReelProps> = ({ spinning, finalSymbol, onSpinComplete }) => {
  const reelRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (spinning) {
      const delta = 2 * NUM_ICONS + Math.round(Math.random() * NUM_ICONS);
      const duration = (8 + delta) * TIME_PER_ICON;

      setOffset(prev => prev + delta * ICON_HEIGHT);

      setTimeout(() => {
        if (reelRef.current) {
          reelRef.current.style.transition = `transform ${duration}ms cubic-bezier(.41,-0.01,.63,1.09)`;
          reelRef.current.style.transform = `translateY(${-(offset + delta * ICON_HEIGHT)}px)`;
        }
      }, 0);

      setTimeout(() => {
        if (reelRef.current) {
          reelRef.current.style.transition = 'none';
          reelRef.current.style.transform = `translateY(${-((offset + delta * ICON_HEIGHT) % (NUM_ICONS * ICON_HEIGHT))}px)`;
        }
        onSpinComplete();
      }, duration);
    }
  }, [spinning]);

  return (
    <div className="reel w-[100px] h-[300px] border border-black/30 rounded-md overflow-hidden relative bg-gray-800">
      <div 
        ref={reelRef}
        className="absolute top-0 left-0 w-full"
        style={{ transform: `translateY(${-offset}px)` }}
      >
        {[...SYMBOLS, ...SYMBOLS, ...SYMBOLS].map((symbol, index) => (
          <div key={index} className="h-[100px] flex items-center justify-center text-6xl">
            {symbol}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>
    </div>
  );
};

const competition = {
  id: 'global',
  name: 'Global competition',
  enteringPrice: BigInt(+DEFAULT_PARTICIPATION_FEE.toString()),
  prizeFund: 0n,
};

export default function Slot_Machine({
  params,
}: {
  params: { competitionId: string };
}){
  const [balance, setBalance] = useState('0');
  const [bet, setBet] = useState<number>(1);
  const [jackpot, setJackpot] = useState('0');
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([0, 1, 2]);
  const [slotMachine, setSlotMachine] = useState<SlotMachine | null>(null);
  const [spinCompleteCount, setSpinCompleteCount] = useState(0);

  const { client } = useContext(ZkNoidGameContext);

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  const networkStore = useNetworkStore();
  const protokitChain = useProtokitChainStore();
  const notificationStore = useNotificationStore();

  useEffect(() => {
    const initializeSlotMachine = async () => {
      if (client) {
        const clientAppChain = client as ClientAppChain<
          typeof tokenTwistConfig.runtimeModules,
          any,
          any,
          any
        >;
  
        try {
          await clientAppChain.start();
          const resolvedSlotMachine = clientAppChain.runtime.resolve('SlotMachine');
          setSlotMachine(resolvedSlotMachine);
        } catch (error) {
          console.error("Failed to initialize SlotMachine:", error);
        }
      }
    };
  
    initializeSlotMachine();
  }, [client]);

  const fetchBalance = async () => {
    if (!slotMachine) return;
    const balance = await slotMachine.getBalance();
    setBalance(balance.toString());
  };

  const fetchJackpot = async () => {
    if (!slotMachine) return;
    const jackpot = await slotMachine.getJackpot();
    setJackpot(jackpot.toString());
  };

  const handleSpin = async () => {
    if (!slotMachine || !client) return;
    console.log('Spin started'); // Debugging statement
    setSpinning(true);
    setSpinCompleteCount(0);
    try {
      const tx = await client.transaction(
        PublicKey.fromBase58(networkStore.address!),
        async () => {
          await slotMachine.spin(UInt64.from(BigInt(bet)));
        }
      );
  
      await tx.sign();
      await tx.send();
  
    } catch (error) {
      console.error('Error spinning:', error);
      notificationStore.create({
        type: 'error',
        message: 'Error spinning the slot machine!',
      });
      setSpinning(false); // Reset spinning state if an error occurs
    }
  };

  const handleSpinComplete = () => {
    setSpinCompleteCount(prev => prev + 1);
    if (spinCompleteCount === 2) {
      finalizeSpin();
    }
  };

  const finalizeSpin = async () => {
    if (!slotMachine) return;
    const lastSpin = await slotMachine.getLastSpin();
    const spinResult = lastSpin.toBigInt();

    const reel3 = Number(spinResult % 10n);
    const reel2 = Number((spinResult / 10n) % 10n);
    const reel1 = Number(spinResult / 100n);

    setReels([reel1, reel2, reel3]);
    setSpinning(false);
    fetchBalance();
    fetchJackpot();
  };

  useEffect(() => {
    fetchBalance();
    fetchJackpot();
  }, [protokitChain.block, slotMachine]);

  return (
    <GamePage
      gameConfig={tokenTwistConfig}
      image={CoverSVG}
      mobileImage={CoverSVG}
      defaultPage={'Game'}
    >
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Rules />
          <HowToPlay />
        </div>
      </div>

      <div className="flex gap-8 mt-0">
        {/* Left Column */}
        <motion.div
          className="flex flex-col gap-2 items-center justify-center rounded-lg border border-left-accent p-4 w-2/3 pt-6"
          animate={'windowed'}
        >
          <div className="flex gap-4 bg-gradient-to-b from-gray-700 to-gray-900 p-4 rounded-lg shadow-inner">
            {[0, 1, 2].map((index) => (
              <Reel 
                key={index} 
                spinning={spinning} 
                finalSymbol={reels[index]} 
                onSpinComplete={handleSpinComplete}
              />
            ))}
          </div>
          
          <div className='flex gap-6'>
            <span className='mt-4'><BetControl bet={bet} setBet={setBet} spinning={spinning} /></span> 

            <Button
              label={spinning ? 'Spinning...' : 'Spin'}
              onClick={handleSpin}
              disabled={spinning}
              className="mt-4 text-black p-4 text-2xl px-6 rounded-full"
            />
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="w-1/3 p-4 border border-left-accent rounded-lg">  
          <h2 className="text-left-accent text-xl">Additional Content</h2>
          <p className="text-left-accent">
            Here you can display additional information or features related to your game or slot machine.
          </p>
          <h2 className="text-left-accent text-xl">Game Info</h2>
          <p className="text-left-accent">Balance: $ {balance} Znakes </p>
          <p className="text-left-accent">Jackpot: $ {jackpot} Znakes</p>
        </div>
      </div>
    </GamePage>
  );
};

