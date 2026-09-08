export default function EmblemWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 flex items-center justify-center z-0 opacity-[0.025]"
    >
      <div className="font-display text-[18rem] text-navy select-none leading-none">
        ⚖
      </div>
    </div>
  );
}
