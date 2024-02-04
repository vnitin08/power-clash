'use client';

import { Client, ClientState, useClientStore } from '@/lib/stores/client';
import Link from 'next/link';
import { UInt64 } from 'o1js';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { Competition, client } from 'zknoid-chain-dev';
import Header from '../Header';
import { GameType } from '@/app/constants/games';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useMinaBalancesStore,
  useObserveMinaBalance,
} from '@/lib/stores/minaBalances';
import {
  useObserveProtokitBalance,
  useProtokitBalancesStore,
} from '@/lib/stores/protokitBalances';
import { ICompetition } from '@/lib/types';
import { fromContractCompetition } from '@/lib/typesConverter';
import { AppChain } from '@proto-kit/sdk';

const timeStampToStringDate = (timeStamp: number): string => {
  var date = new Date(timeStamp);
  return (
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  );
};

const competitionButton = (c: ICompetition): ReactElement => {
  let defaultButton = (
    <div className="flex content-center items-center justify-center rounded border-solid bg-gray-500 px-6 py-4 font-bold text-white">
      I am not a button
    </div>
  );

  let playButton = (
    <Link href={`/games/arkanoid/${c.competitionId}`}>
      <div className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
        Play
      </div>
    </Link>
  );

  let registerButton = (
    <div className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
      Register
    </div>
  );

  let finished = (
    <div className="flex content-center items-center justify-center rounded border-solid bg-gray-500 px-6 py-4 font-bold text-white">
      Game finished
    </div>
  );
  let curTime = Date.now();

  let registered = false;
  let shouldRegister =
    c.prereg && curTime > c.preregStartTime && curTime < c.preregEndTime;
  let isFinished = curTime > c.competitionEndTime;

  let isGameReady =
    (!shouldRegister || (shouldRegister && registered)) && !isFinished;

  let finalButton = defaultButton;

  if (isFinished) {
    finalButton = finished;
  } else if (shouldRegister) {
    finalButton = registerButton;
  } else if (isGameReady) {
    finalButton = playButton;
  }

  return finalButton;
};

export default function ArkanoidCompetitionsListPage() {
  useObserveMinaBalance();
  useObserveProtokitBalance();

  let [competitions, setCompetitions] = useState<ICompetition[]>([]);
  const networkStore = useNetworkStore();
  const minaBalances = useMinaBalancesStore();
  const protokitBalances = useProtokitBalancesStore();
  const client = useClientStore();

  useEffect(() => {
    client.start().then(getListOfCompetitions);
  }, []);

  const getListOfCompetitions = async (client: Client) => {
    let result: ICompetition[] = [];

    let lastId =
      (await client.query.runtime.ArkanoidGameHub.lastCompetitonId.get())?.toBigInt() ||
      0;

    for (let i = 0; i < lastId; i++) {
      let curCompetition = await client.query.runtime.ArkanoidGameHub.competitions.get(
        UInt64.from(i),
      );

      result.push(fromContractCompetition(i, curCompetition!));
    }

    setCompetitions(competitions.concat(...result));
  };

  return (
    <>
      <Header
        address={networkStore.address}
        connectWallet={networkStore.connectWallet}
        minaBalance={
          networkStore.address
            ? minaBalances.balances[networkStore.address]
            : 0n
        }
        protokitBalance={
          networkStore.address
            ? protokitBalances.balances[networkStore.address]
            : 0n
        }
        walletInstalled={networkStore.walletInstalled()}
        currentGame={GameType.Arkanoid}
      />
      <div className="flex min-h-screen w-screen flex-col items-center py-10">
        <Link href={`/games/arkanoid/new-competition`} className="p-5">
          <div className="h-50 w-100 rounded border-solid bg-white p-5">
            Create competition{' '}
          </div>
        </Link>
        <h1> Arkanoid competitions list </h1>
        <table className="min-w-max text-left">
          <thead className="bg-gray-300 font-semibold">
            <tr>
              <th className="px-6 py-3"> Name </th>
              <th className="px-6 py-3"> Seed </th>
              <th className="px-6 py-3"> Prereg </th>
              <th className="px-6 py-3"> PreregBefore </th>
              <th className="px-6 py-3"> PreregAfter </th>
              <th className="px-6 py-3"> CompetitionStart </th>
              <th className="px-6 py-3"> CompetitionEnd </th>
              <th className="px-6 py-3"> Funds </th>
              <th className="px-6 py-3"> ParticipationFee </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((c) => (
              <tr
                className={
                  'border-b ' + (c.funds > 0 ? 'bg-amber-100' : 'bg-white')
                }
              >
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.seed}</td>
                <td className="px-6 py-4">{c.prereg.toString()}</td>
                <td className="px-6 py-4">
                  {timeStampToStringDate(c.preregStartTime)}
                </td>
                <td className="px-6 py-4">
                  {timeStampToStringDate(c.preregEndTime)}
                </td>
                <td className="px-6 py-4">
                  {timeStampToStringDate(c.competitionStartTime)}
                </td>
                <td className="px-6 py-4">
                  {timeStampToStringDate(c.competitionEndTime)}
                </td>
                <td className="px-6 py-4">{c.funds}</td>
                <td className="px-6 py-4">{c.participationFee}</td>
                <td>
                  {competitionButton(c)}
                  {/* <Link href={`/games/arkanoid/${c.competitionId}`}>
                    <div className="flex content-center items-center justify-center rounded border-solid bg-blue-500 px-6 py-4 font-bold text-white">
                      Play
                    </div>
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}