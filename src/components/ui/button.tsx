import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 hover:bg-slate-100 text-slate-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-slate-100 text-slate-600",
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
