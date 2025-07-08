import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CourseGrid from "@/components/organisms/CourseGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import { courseService } from "@/services/api/courseService";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Development", "Data Science", "Design", "Marketing", "Photography", "Finance"];

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      searchCourses(searchQuery);
    } else {
      filterCourses();
    }
  }, [courses, selectedCategory, searchParams]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const searchCourses = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.searchCourses(query);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Error searching courses:", error);
      setError("Failed to search courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCoursesByCategory(selectedCategory);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Error filtering courses:", error);
      setError("Failed to filter courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleRetry = () => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      searchCourses(searchQuery);
    } else {
      loadCourses();
    }
  };

  const searchQuery = searchParams.get("search");
  const displayTitle = searchQuery 
    ? `Search Results for "${searchQuery}"`
    : selectedCategory === "All" 
      ? "All Courses"
      : `${selectedCategory} Courses`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-4">
          {displayTitle}
        </h1>
        <p className="text-gray-600 text-lg">
          Discover courses from industry experts and advance your skills
        </p>
      </div>

      {!searchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}

      <CourseGrid
        courses={filteredCourses}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Browse;