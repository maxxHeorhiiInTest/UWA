import type { SVGProps } from "react";

// Traced from the official UWA emblem artwork: three gold peaks over a
// blue shield mark. Paths were extracted from the source raster via
// contour tracing, so the coordinates below are intentionally exact.
const GOLD_PATH =
  "M 117,416.1 L 91,414.9 L 85.3,406 L 108.2,100 L 113,79.8 L 120,73.5 L 184,74.1 L 192.8,81 L 201.9,119 L 254.7,393 L 248,401.2 L 223,409.3 L 180,399 L 169.2,252 L 160.4,233 L 162.2,209 L 158.3,184 L 153,180.4 L 128.7,403 L 117,416.1 Z " +
  "M 533,378.1 L 490,378.1 L 484.3,373 L 504.9,232 L 520.1,184 L 537.1,82 L 548,72.7 L 611,72.6 L 619.3,86 L 639.9,355 L 626,366.4 L 599.3,366 L 582.3,195 L 576,189.1 L 550.3,365 L 533,378.1 Z " +
  "M 299,399.1 L 272,398.4 L 265.8,384 L 318.8,166 L 332,158.6 L 407,160.5 L 429.1,230 L 460.7,378 L 415,387.4 L 393.5,382 L 384.3,371 L 370.1,305 L 365,301.3 L 339.8,388 L 330,396.4 L 299,399.1 Z";

const BLUE_PATH =
  "M 357,887.3 L 342,884.9 L 210.3,727 L 161,677.7 L 143,649 L 114,631.3 L 110,613.4 L 78.7,574 L 82.2,555 L 78,543.9 L 64,536 L 61.1,490 L 31.2,444 L 39,443 L 44,454.6 L 58,455.2 L 78,432.3 L 108,429 L 114.9,441 L 111.6,499 L 169,511.3 L 174.4,505 L 170.9,444 L 176,423 L 318,404.3 L 323.3,421 L 305.6,505 L 390,506.4 L 395.7,503 L 396.3,492 L 376.4,413 L 381,404 L 405,396.8 L 439,393.8 L 458,398.3 L 530,385.5 L 536.7,399 L 518.5,558 L 520,567.5 L 529,569.3 L 543,563 L 595.5,510 L 588,390 L 595,380.3 L 621,377.9 L 628.3,390 L 638.3,524 L 607,563 L 606,592.9 L 357,887.3 Z " +
  "M 374.6,724 L 444.8,659 L 424.5,591 L 400,584.6 L 309,586 L 300,582.1 L 296,569.6 L 286,569.4 L 279,620.6 L 298.6,659 L 311.7,665 L 315.9,688 L 326.1,698 L 329,712 L 345,720.4 L 358,710.6 L 363.5,723 L 374.6,724 Z " +
  "M 218.6,632 L 222.3,621 L 214,603.9 L 190.5,601 L 191.6,622 L 204,631.4 L 218.6,632 Z";

export const LOGO_VIEW_BOX = "10 49 650 859";

export function Logo({
  highlight = true,
  idPrefix = "uwa-logo",
  ...props
}: SVGProps<SVGSVGElement> & { highlight?: boolean; idPrefix?: string }) {
  const clipId = `${idPrefix}-clip`;
  const shineId = `${idPrefix}-shine`;

  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="UWA"
      {...props}
    >
      {highlight && (
        <defs>
          <clipPath id={clipId}>
            <path d={BLUE_PATH} clipRule="evenodd" />
          </clipPath>
          <linearGradient
            id={shineId}
            gradientUnits="userSpaceOnUse"
            x1="100"
            y1="470"
            x2="480"
            y2="700"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="20%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      <path d={GOLD_PATH} fill="#E7B93A" />
      <path d={BLUE_PATH} fill="#2C5FC4" fillRule="evenodd" />

      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <line
            x1="100"
            y1="470"
            x2="480"
            y2="700"
            stroke={`url(#${shineId})`}
            strokeWidth="60"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
