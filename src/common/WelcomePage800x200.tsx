type Props = {
  subtitle: string;
};

// A wide, short strip: the logo sits beside the text instead of above it,
// because 200px of height has no room for a stacked layout.
export const WelcomePage800x200 = ({ subtitle }: Props) => (
  <div className="relative grid place-items-center w-full h-full bg-bg font-mono overflow-hidden">
    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-border-player" />
    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-border-player" />
    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-border-player" />
    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-border-player" />

    <div className="grid grid-flow-col items-center gap-10">
      <div className="grid grid-flow-col items-end leading-none">
        <span className="text-[64px] font-black text-white leading-none">
          H
        </span>
        <span className="text-[42px] font-black text-green leading-none pb-2 px-1">
          2
        </span>
        <span className="text-[64px] font-black text-white leading-none">
          H
        </span>
      </div>

      <div className="grid gap-2 justify-items-start">
        <span className="text-xl tracking-[5px] text-white uppercase">
          {subtitle}
        </span>

        <span className="text-lg tracking-[6px] text-dim uppercase">
          iRacing Overlay
        </span>

        <div className="grid grid-flow-col items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-pulse bg-red" />
          <span className="text-sm tracking-[3px] text-dim uppercase">
            Waiting for session
          </span>
        </div>
      </div>
    </div>
  </div>
);
