"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none disabled:opacity-40 disabled:pointer-events-none",
          "cursor-pointer active:scale-[0.98]",
          {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-sm",
            lg: "px-8 py-4 text-base",
          }[size],
          {
            primary:
              "bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.3)]",
            secondary:
              "border border-[var(--border)] text-[var(--fg)] bg-[rgba(var(--surface-rgb),0.06)] hover:border-[rgba(var(--accent-rgb),0.6)]",
            ghost: "text-[var(--fg-muted)] hover:text-[var(--fg)]",
          }[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
