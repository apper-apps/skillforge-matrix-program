import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import RatingStars from "@/components/molecules/RatingStars";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, className }) => {
  return (
    <Card className={`overflow-hidden hover:scale-105 transition-transform duration-300 ${className}`}>
      <Link to={`/course/${course.Id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="accent">
              {course.level}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-secondary mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{course.instructor.name}</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <RatingStars rating={course.rating} showRating />
            <span className="text-sm text-gray-500">
              ({course.studentsCount.toLocaleString()} students)
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <ApperIcon name="Clock" size={14} />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <ApperIcon name="BookOpen" size={14} />
                {course.category}
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                ${course.price}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CourseCard;