import React from "react";
import Button from "@/components/atoms/Button";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, className }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "primary" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;