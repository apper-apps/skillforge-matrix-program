import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search courses...", className }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-12 pl-4 h-12 text-base border-2 border-gray-200 focus:border-primary"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 h-10 px-3"
          variant="primary"
        >
          <ApperIcon name="Search" size={18} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;