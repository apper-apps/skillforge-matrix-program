import React from "react";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CourseGrid = ({ courses, loading, error, onRetry }) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (courses.length === 0) {
    return <Empty />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.Id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;