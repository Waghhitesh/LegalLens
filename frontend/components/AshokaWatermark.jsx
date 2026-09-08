export default function AshokaWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-1/2 z-0 select-none"
      style={{
        transform: "translate(-50%, -50%)",
        width: "42vw",
        height: "42vw",
        opacity: 0.07,
      }}
    >
      {/* Inline SVG - Ashoka Stambha representation */}
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", filter: "sepia(1) saturate(3) hue-rotate(5deg) brightness(0.6)" }}>
        {/* Ashoka Chakra (24-spoke wheel) */}
        <circle cx="100" cy="60" r="50" fill="none" stroke="#C8952A" strokeWidth="3" />
        <circle cx="100" cy="60" r="6" fill="#C8952A" />
        {Array.from({length: 24}, (_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 6 * Math.sin(rad);
          const y1 = 60 - 6 * Math.cos(rad);
          const x2 = 100 + 47 * Math.sin(rad);
          const y2 = 60 - 47 * Math.cos(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8952A" strokeWidth="1.5" />;
        })}
        {/* Lions (simplified) */}
        <ellipse cx="70" cy="110" rx="18" ry="12" fill="#C8952A" opacity="0.8" />
        <ellipse cx="100" cy="108" rx="18" ry="12" fill="#C8952A" opacity="0.9" />
        <ellipse cx="130" cy="110" rx="18" ry="12" fill="#C8952A" opacity="0.8" />
        {/* Lion heads */}
        <circle cx="70" cy="98" r="9" fill="#C8952A" />
        <circle cx="100" cy="96" r="9" fill="#C8952A" />
        <circle cx="130" cy="98" r="9" fill="#C8952A" />
        {/* Abacus base */}
        <rect x="60" y="120" width="80" height="8" rx="2" fill="#C8952A" />
        {/* Inscription base */}
        <rect x="50" y="128" width="100" height="6" rx="1" fill="#C8952A" opacity="0.6" />
        {/* Satyameva Jayate text placeholder */}
        <text x="100" y="148" textAnchor="middle" fontSize="8" fill="#C8952A" fontFamily="serif" opacity="0.8">SATYAMEVA JAYATE</text>
        {/* Dharma wheel on abacus */}
        <circle cx="100" cy="124" r="4" fill="none" stroke="#C8952A" strokeWidth="1.5" />
        {/* Elephant */}
        <ellipse cx="60" cy="124" rx="8" ry="5" fill="#C8952A" opacity="0.7" />
        {/* Horse */}
        <ellipse cx="140" cy="124" rx="8" ry="5" fill="#C8952A" opacity="0.7" />
      </svg>
    </div>
  );
}
