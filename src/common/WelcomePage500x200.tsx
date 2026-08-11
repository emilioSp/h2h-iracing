type Props = {
  subtitle: string;
};

// The same shape as the 800x200 strip, with smaller type: 500px of width does
// not fit the larger logo and letter spacing.
export const WelcomePage500x200 = ({ subtitle }: Props) => (
  <div className="relative grid place-items-center w-full h-full bg-bg font-mono overflow-hidden">
    <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-border-player" />
    <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-border-player" />
    <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-border-player" />
    <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-border-player" />

    <div className="grid grid-flow-col items-center gap-6">
      <div className="grid grid-flow-col items-end leading-none">
        <span className="text-[44px] font-black text-white leading-none">
          H
        </span>
        <span className="text-[30px] font-black text-green leading-none pb-1 px-0.5">
          2
        </span>
        <span className="text-[44px] font-black text-white leading-none">
          H
        </span>
      </div>

      <div className="grid gap-1.5 justify-items-start">
        <span className="text-base tracking-[4px] text-white uppercase">
          {subtitle}
        </span>

        <span className="text-sm tracking-[4px] text-dim uppercase">
          iRacing Overlay
        </span>

        <div className="grid grid-flow-col items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse bg-red" />
          <span className="text-xs tracking-[2px] text-dim uppercase">
            Waiting for session
          </span>
        </div>
      </div>
    </div>
  </div>
);
