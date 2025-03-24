// Button Component
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils"; // Ensure this path is correct

const Button = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500";

    const variantClasses = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      link: "text-blue-500 hover:underline",
    };

    const sizeClasses = {
      default: "text-base",
      sm: "text-sm px-3 py-1.5",
      lg: "text-lg px-5 py-3",
      icon: "p-2 rounded-full",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant] || variantClasses.default,
          sizeClasses[size] || sizeClasses.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
