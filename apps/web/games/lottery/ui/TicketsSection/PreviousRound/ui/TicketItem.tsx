import { cn } from '@/lib/helpers';
import { Currency } from '@/constants/currency';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { useChainStore } from '@/lib/stores/minaChain';

type Number = {
  number: number;
  win: boolean;
};

export function TicketItem({
  roundId,
  numbers,
  funds,
  noCombination,
}: {
  roundId: number,
  numbers: Number[];
  funds: number | undefined;
  noCombination: boolean;
}) {
  const workerClient = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const chainStore = useChainStore();

  return (
    <div
      className={
        'grid grid-cols-3 border-b py-[0.521vw] first:border-t hover:bg-[#464646]'
      }
    >
      <div className={'flex flex-row items-center gap-[0.25vw]'}>
        {numbers.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex h-[1.33vw] w-[1.33vw] items-center justify-center rounded-[0.15vw] border font-plexsans text-[0.833vw]',
              {
                'border-left-accent bg-left-accent': item.win,
                'border-foreground text-foreground': !item.win,
                'text-black': item.win,
              }
            )}
          >
            {item.number}
          </div>
        ))}
      </div>
      <div
        className={
          'flex flex-row items-center gap-[0.25vw] font-plexsans text-[0.833vw]'
        }
      >
        {!!funds ? (
          <>
            <span>{funds}</span>
            <span>{Currency.ZNAKES}</span>
          </>
        ) : noCombination ? (
          <span>No combination</span>
        ) : (
          <span>No funds</span>
        )}
      </div>
      {!!funds && (
        <button
          className={
            'items-center rounded-[0.33vw] bg-left-accent px-[0.74vw] py-[0.37vw] font-museo text-[0.833vw] font-medium text-black hover:opacity-70'
          }
          onClick={() => {
            workerClient.getReward(
              networkStore.address!,
              Number(chainStore.block?.slotSinceGenesis!),
              roundId,
              numbers.map((x) => x.number),
              1
            );
          }}
        >
          Claim
        </button>
      )}
    </div>
  );
}