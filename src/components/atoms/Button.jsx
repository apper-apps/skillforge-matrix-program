import React from "react";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg hover:scale-105 focus:ring-primary",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    accent: "bg-gradient-accent text-secondary hover:shadow-lg hover:scale-105 focus:ring-accent",
    outline: "border border-gray-300 text-secondary hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-secondary hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-error text-white hover:bg-red-600 focus:ring-error"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;