import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = ({ progress, className, showPercentage = true }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(clampedProgress)}% Complete
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;