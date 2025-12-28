"use client";

import * as React from "react";

type PrintButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function PrintButton({ className, children }: PrintButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.print();
      }}
    >
      {children || "Print / Save as PDF"}
    </button>
  );
}
