import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, ...props }) {
  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("border-b p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold leading-tight", className)} {...props}>
      {children}
    </h3>
  );
}