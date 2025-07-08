import React from "react";
import ApperIcon from "@/components/ApperIcon";

const RatingStars = ({ rating, size = 16, showRating = false, className }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <ApperIcon
            key={`full-${index}`}
            name="Star"
            size={size}
            className="fill-accent text-accent"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <ApperIcon name="Star" size={size} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <ApperIcon name="Star" size={size} className="fill-accent text-accent" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <ApperIcon
            key={`empty-${index}`}
            name="Star"
            size={size}
            className="text-gray-300"
          />
        ))}
      </div>
      {showRating && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;