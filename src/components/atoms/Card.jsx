import React from "react";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white shadow-sm card-shadow hover:card-shadow-hover transition-shadow duration-200",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;