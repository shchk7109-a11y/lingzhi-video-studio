"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none";

    const variants = {
      primary: "border border-[var(--gold)] text-[var(--gold)] bg-transparent hover:bg-[var(--gold-dim)] disabled:opacity-50",
      secondary: "border border-[var(--border-light)] text-[var(--text)] bg-transparent hover:bg-[var(--bg-hover)] disabled:opacity-50",
      ghost: "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] disabled:opacity-50",
      danger: "border border-[var(--red)] text-[var(--red)] bg-transparent hover:bg-red-900/20 disabled:opacity-50",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-2.5 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
