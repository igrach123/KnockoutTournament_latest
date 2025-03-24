import React, { forwardRef } from "react";
import { cn } from "@/lib/utils"; // Ensure this path is correct

// Input Component
const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-2 rounded-md border border-gray-300",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        "transition-colors duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
export { Input };
