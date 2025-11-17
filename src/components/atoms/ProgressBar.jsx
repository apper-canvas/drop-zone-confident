import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  className = "", 
  variant = "primary",
  showPercentage = true,
  animated = true 
}) => {
  const variants = {
    primary: "from-primary to-blue-600",
    success: "from-success to-emerald-600", 
    error: "from-error to-red-600",
    warning: "from-warning to-orange-600"
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-900">{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            variants[variant]
          )}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut" 
          }}
        />
        
        {animated && progress > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ 
              duration: 2,
              repeat: progress < 100 ? Infinity : 0,
              ease: "linear"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;