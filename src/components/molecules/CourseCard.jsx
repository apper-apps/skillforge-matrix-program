import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import RatingStars from "@/components/molecules/RatingStars";

// Default avatar as data URI to ensure it always loads
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"

export default function CourseCard({ course, className }) {
  const [imageError, setImageError] = useState(false)
  
  if (!course) return null

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${className}`}>
      <Link to={`/course/${course.Id}`} className="block">
        <div className="aspect-video bg-gray-100 mb-4 rounded-lg overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <div className="flex items-center gap-2">
            <img
              src={imageError ? DEFAULT_AVATAR : course.instructor?.avatar || DEFAULT_AVATAR}
              alt={course.instructor?.name || 'Instructor'}
              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
              onError={handleImageError}
            />
            <span className="text-sm text-gray-600">{course.instructor?.name || 'Unknown Instructor'}</span>
</div>
          
          <div className="flex items-center gap-2">
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