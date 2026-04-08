type Props = {
  subtitle: string;
};

export const WelcomePage = ({ subtitle }: Props) => (
  <div className="relative grid place-items-center w-200 h-120 bg-bg font-mono overflow-hidden">
    <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-border-player" />
    <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-border-player" />
    <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-border-player" />
    <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-border-player" />

    <div className="grid justify-items-center gap-5">
      <div className="grid grid-flow-col items-end leading-none">
        <span className="text-[110px] font-black text-white leading-none">
          H
        </span>
        <span className="text-[72px] font-black text-green leading-none pb-3 px-1">
          2
        </span>
        <span className="text-[110px] font-black text-white leading-none">
          H
        </span>
      </div>

      <div className="grid grid-flow-col items-center gap-4">
        <div className="h-px w-20 bg-border-player" />
        <span className="text-3xl tracking-[7px] text-dim uppercase">
          {subtitle}
        </span>
        <div className="h-px w-20 bg-border-player" />
      </div>

      <span className="text-3xl tracking-[12px] text-dim uppercase">
        iRacing Overlay
      </span>

      <div className="grid grid-flow-col items-center gap-3 mt-6">
        <div className="w-3 h-3 rounded-full animate-pulse bg-red" />
        <span className="text-xl tracking-[4px] text-dim uppercase">
          Waiting for session
        </span>
      </div>
    </div>
  </div>
);
