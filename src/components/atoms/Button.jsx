import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl focus:ring-primary/50",
    secondary: "bg-gradient-to-r from-secondary to-slate-600 text-white shadow-lg hover:from-slate-600 hover:to-slate-700 hover:shadow-xl focus:ring-secondary/50",
    accent: "bg-gradient-to-r from-accent to-cyan-600 text-white shadow-lg hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl focus:ring-accent/50",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl focus:ring-success/50",
    error: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl focus:ring-error/50",
    outline: "border-2 border-primary bg-transparent text-primary shadow-lg hover:bg-primary hover:text-white hover:shadow-xl focus:ring-primary/50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:shadow-md focus:ring-gray-500/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:scale-100 active:scale-100",
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;