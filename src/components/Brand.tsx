import "./brand.css";

/** The LIFE.EXE mark: a system tile holding a path from where you are to a next step. */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`logo-mark ${className}`} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect className="logo-mark__tile" width="32" height="32" rx="9" />
      <path className="logo-mark__path" d="M9.5 21.5C15 21.5 15 10.5 21 10.5H23.5M20 7l3.5 3.5L20 14" />
      <circle className="logo-mark__dot" cx="9.5" cy="21.5" r="3.4" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark__life">LIFE</span>
      <span className="wordmark__exe">
        <span className="wordmark__dot">.</span>EXE
      </span>
    </span>
  );
}

export function Brand() {
  return (
    <span className="brand">
      <LogoMark />
      <Wordmark />
    </span>
  );
}
