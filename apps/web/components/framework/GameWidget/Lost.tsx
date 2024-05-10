import { SadSmileSVG } from '@/components/ui/games-store/shared/misc/svg';
import { GradientButton } from '@/components/ui/games-store/shared/GradientButton';

export const Lost = ({ startGame }: { startGame: () => void }) => {
  return (
    <div
      className={
        'flex h-full w-full items-center justify-center px-[5%] py-[15%] lg:p-0'
      }
    >
      <div className={'flex flex-col items-center justify-center gap-4'}>
        <SadSmileSVG />
        <span className={'text-headline-1'}>You’ve lost! Please try again</span>
        <GradientButton
          title={'Restart game'}
          onClick={startGame}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3154_14201)">
                <path
                  d="M12.0002 1.99991C13.3267 2.00426 14.6392 2.27165 15.8617 2.7866C17.0842 3.30154 18.1924 4.05383 19.1222 4.99991H16.0002C15.735 4.99991 15.4806 5.10527 15.2931 5.2928C15.1056 5.48034 15.0002 5.73469 15.0002 5.99991C15.0002 6.26513 15.1056 6.51948 15.2931 6.70702C15.4806 6.89455 15.735 6.99991 16.0002 6.99991H20.1432C20.6356 6.99965 21.1078 6.80391 21.456 6.45572C21.8042 6.10752 21.9999 5.63534 22.0002 5.14291V0.99991C22.0002 0.734693 21.8948 0.480339 21.7073 0.292803C21.5198 0.105267 21.2654 -9.02467e-05 21.0002 -9.02467e-05C20.735 -9.02467e-05 20.4806 0.105267 20.2931 0.292803C20.1056 0.480339 20.0002 0.734693 20.0002 0.99991V3.07791C18.3474 1.58936 16.3128 0.59032 14.1243 0.192659C11.9358 -0.205002 9.67983 0.0144217 7.60899 0.826357C5.53815 1.63829 3.73422 3.01068 2.39921 4.78983C1.06421 6.56899 0.250844 8.68465 0.0502025 10.8999C0.0372859 11.0392 0.0535183 11.1796 0.0978654 11.3122C0.142213 11.4449 0.213702 11.5668 0.307779 11.6703C0.401856 11.7738 0.516457 11.8565 0.644281 11.9133C0.772104 11.97 0.910348 11.9995 1.0502 11.9999C1.29479 12.003 1.53174 11.9148 1.71466 11.7524C1.89759 11.59 2.01332 11.3651 2.0392 11.1219C2.26182 8.63266 3.40718 6.31661 5.25028 4.62875C7.09339 2.94088 9.50102 2.0032 12.0002 1.99991Z"
                  fill="#252525"
                  className={'group-hover:fill-left-accent'}
                />
                <path
                  d="M22.951 12.0002C22.7064 11.9971 22.4695 12.0854 22.2865 12.2478C22.1036 12.4102 21.9879 12.635 21.962 12.8782C21.7967 14.7814 21.0889 16.5973 19.9227 18.1104C18.7564 19.6235 17.1806 20.7703 15.3821 21.4148C13.5837 22.0592 11.6382 22.1743 9.77635 21.7463C7.91451 21.3183 6.21449 20.3653 4.878 19.0002H8C8.26522 19.0002 8.51957 18.8949 8.70711 18.7073C8.89464 18.5198 9 18.2654 9 18.0002C9 17.735 8.89464 17.4806 8.70711 17.2931C8.51957 17.1056 8.26522 17.0002 8 17.0002H3.857C3.6131 17.0001 3.37156 17.048 3.1462 17.1413C2.92084 17.2346 2.71607 17.3714 2.54361 17.5438C2.37115 17.7163 2.23436 17.9211 2.14109 18.1464C2.04781 18.3718 1.99987 18.6133 2 18.8572V23.0002C2 23.2654 2.10536 23.5198 2.29289 23.7073C2.48043 23.8949 2.73478 24.0002 3 24.0002C3.26522 24.0002 3.51957 23.8949 3.70711 23.7073C3.89464 23.5198 4 23.2654 4 23.0002V20.9222C5.65283 22.4108 7.68741 23.4098 9.8759 23.8075C12.0644 24.2051 14.3204 23.9857 16.3912 23.1738C18.4621 22.3618 20.266 20.9895 21.601 19.2103C22.936 17.4311 23.7494 15.3155 23.95 13.1002C23.9629 12.9609 23.9467 12.8205 23.9023 12.6879C23.858 12.5552 23.7865 12.4333 23.6924 12.3298C23.5983 12.2263 23.4837 12.1436 23.3559 12.0868C23.2281 12.0301 23.0899 12.0006 22.95 12.0002H22.951Z"
                  fill="#252525"
                  className={'group-hover:fill-left-accent'}
                />
              </g>
              <defs>
                <clipPath id="clip0_3154_14201">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
        />
      </div>
    </div>
  );
};
