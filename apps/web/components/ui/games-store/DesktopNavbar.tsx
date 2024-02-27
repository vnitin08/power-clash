'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import Link from 'next/link';
import { useEffect } from 'react';

import { walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';

import { useRegisterWorkerClient } from '@/lib/stores/workerClient';

import { HeaderCard } from './HeaderCard';

const BalanceInfo = dynamic(
  () => import('@/components/ui/games-store/BalanceInfo'),
  {
    ssr: false,
  }
);

const NetworkPicker = dynamic(() => import('@/components/NetworkPicker'), {
  ssr: false,
});

export default function DesktopNavbar({
  autoconnect,
}: {
  autoconnect: boolean;
}) {
  const networkStore = useNetworkStore();

  useEffect(() => {
    if (!walletInstalled()) return;

    if (autoconnect) {
      networkStore.connectWallet();
    }
  }, []);

  return (
    <header className="z-10 flex h-[91px] w-full items-center px-3 lg:px-[50px]">
      <div className={'flex w-full items-center justify-between'}>
        <Link href={'/'}>
          <Image
            src={'/image/zknoid-logo.svg'}
            alt={'ZkNoid logo'}
            width={219}
            height={47}
          />
        </Link>
        {networkStore.walletConnected && <BalanceInfo />}

        <div className="flex gap-5">
          {networkStore.walletConnected ? (
            <>
              <HeaderCard
                image="/image/cards/account.svg"
                isMiddle={true}
                text={networkStore.address!.substring(0, 10) + '..'}
              />
              <NetworkPicker />
            </>
          ) : walletInstalled() ? (
            <HeaderCard
              image="/image/cards/account.svg"
              text="Connect wallet"
              isMiddle={true}
              onClick={() => {
                networkStore.connectWallet();
              }}
            />
          ) : (
            <Link href="https://www.aurowallet.com/">
              <HeaderCard
                image="/image/cards/account.svg"
                text="Install wallet"
                isMiddle={true}
                onClick={() => {
                  networkStore.connectWallet();
                }}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
