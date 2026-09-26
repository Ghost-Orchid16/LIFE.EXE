import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 8h9.5M8.5 4l4 4-4 4" />
  </Icon>
);

export const ArrowUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 13V3.5M4 7.5l4-4 4 4" />
  </Icon>
);

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 8.5l3 3 6-7" />
  </Icon>
);

export const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 3v10M3 8h10" />
  </Icon>
);

export const Retry = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 8a5 5 0 1 1-1.6-3.7" />
    <path d="M13 2.8v3.2H9.8" />
  </Icon>
);

export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6l4 4 4-4" />
  </Icon>
);

/** ☀ */
export const Sun = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
  </Icon>
);

/** ◐ */
export const HalfCircle = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 2.25a5.75 5.75 0 0 0 0 11.5z" fill="currentColor" stroke="none" />
  </Icon>
);
