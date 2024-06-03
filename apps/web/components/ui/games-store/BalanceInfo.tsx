import {
  useMinaBalancesStore,
  useObserveMinaBalance,
} from '@/lib/stores/minaBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { useNetworkStore } from '@/lib/stores/network';
import { useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import StoreDepositMenuItem from '@/components/StoreDepositMenuItem';
import CoinImg from './assets/coin.svg';
import MinaCoinImg from './assets/mina.png';
import Image from 'next/image';

export default function BalanceInfo() {
  const minaBalancesStore = useMinaBalancesStore();
  const networkStore = useNetworkStore();
  usePollMinaBlockHeight();
  useObserveMinaBalance();
  const protokitBalancesStore = useProtokitBalancesStore();
  const workerClient = useWorkerClientStore();

  const deposit = (
    Number(protokitBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  const minaDeposit = (
    Number(minaBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  return (
    <>
      {networkStore.walletConnected && (
        <div className="flex w-full flex-col-reverse items-center gap-[5vw] text-base lg:w-auto lg:flex-row lg:gap-[1.25vw]">
          <StoreDepositMenuItem />
          <div className="flex h-full w-full flex-col-reverse items-start gap-[14px] lg:w-auto lg:flex-col lg:gap-[0.313vw]">
            <div className="flex items-center gap-[10px]">
              <Image alt="" src={CoinImg} width={26} height={26} />
              <div className="w-full text-start lg:w-auto">
                Deposit: {deposit}
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <Image alt="" src={MinaCoinImg} width={26} height={26} />
              <div className="w-full text-end lg:w-auto">
                Wallet balance {minaDeposit}
              </div>
            </div>
            {/* <div className="hidden text-[12px] lg:block">
              {workerClient.status}
            </div> */}
          </div>
          {/* <div className="flex w-full flex-col gap-2 lg:block lg:w-auto">
            <div className="block text-[12px] lg:hidden">
              {workerClient.status}
            </div>
          </div> */}
        </div>
      )}
    </>
  );
}
