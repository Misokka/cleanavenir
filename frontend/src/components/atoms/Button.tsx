"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-md font-semibold transition-colors",
        variant === "primary"
          ? "bg-[#083A31] text-white hover:bg-[#3F6868]"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
