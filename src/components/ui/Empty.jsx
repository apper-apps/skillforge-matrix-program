import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No courses found", 
  description = "Try adjusting your search or browse our course catalog",
  actionText = "Browse Courses",
  actionLink = "/",
  icon = "BookOpen"
}) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-secondary mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <Link to={actionLink}>
          <Button variant="primary" size="lg">
            <ApperIcon name="Search" size={18} className="mr-2" />
            {actionText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Empty;