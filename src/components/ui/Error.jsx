import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" size={32} className="text-error" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-secondary mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="primary" size="lg">
            <ApperIcon name="RefreshCw" size={18} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;