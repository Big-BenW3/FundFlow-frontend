/* Double-FF brand mark — the only visual brand lockup (no wordmark text).
 *
 * Layered monogram: a white back "F" offset behind a voltage front "F"
 * on the ink tile, so the two F letterforms read as one stylish mark.
 * Colors mirror tailwind.config.js (ink #0A0A0A, voltage #FAFF69).
 */

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label="FundFlow"
      className={className}
      style={{ display: "inline-grid", placeItems: "center", width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="11" fill="#0A0A0A" />
        {/* back F */}
        <g fill="#FFFFFF">
          <rect x="21" y="10" width="7" height="28" rx="2" />
          <rect x="21" y="10" width="19" height="7" rx="2" />
          <rect x="21" y="21" width="14" height="6" rx="2" />
        </g>
        {/* front F — ink keyline separates it from the back F */}
        <g fill="#FAFF69" stroke="#0A0A0A" strokeWidth="1.5">
          <rect x="9" y="10" width="7" height="28" rx="2" />
          <rect x="9" y="10" width="19" height="7" rx="2" />
          <rect x="9" y="21" width="14" height="6" rx="2" />
        </g>
      </svg>
    </span>
  );
}
