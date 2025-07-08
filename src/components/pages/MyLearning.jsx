import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/molecules/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { enrollmentService } from "@/services/api/enrollmentService";
import { courseService } from "@/services/api/courseService";
import { formatDistanceToNow } from "date-fns";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [enrollmentData, courseData] = await Promise.all([
        enrollmentService.getAll(),
        courseService.getAll()
      ]);
      
      setEnrollments(enrollmentData);
      setCourses(courseData);
    } catch (error) {
      console.error("Error loading learning data:", error);
      setError("Failed to load your learning data");
    } finally {
      setLoading(false);
    }
  };

  const getEnrolledCourses = () => {
    return enrollments.map(enrollment => {
      const course = courses.find(c => c.Id === parseInt(enrollment.courseId));
      return { ...enrollment, course };
    }).filter(item => item.course);
  };

  const getProgressStatus = (progress) => {
    if (progress === 0) return { label: "Not Started", variant: "outline" };
    if (progress < 50) return { label: "In Progress", variant: "primary" };
    if (progress < 100) return { label: "Almost Done", variant: "warning" };
    return { label: "Completed", variant: "success" };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadLearningData} />;
  }

  const enrolledCourses = getEnrolledCourses();

  if (enrolledCourses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-8">
          My Learning
        </h1>
        <Empty
          title="No courses enrolled yet"
          description="Start your learning journey by enrolling in a course"
          actionText="Browse Courses"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-4">
          My Learning
        </h1>
        <p className="text-gray-600 text-lg">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {enrolledCourses.length}
          </div>
          <p className="text-gray-600">Enrolled Courses</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-success mb-2">
            {enrolledCourses.filter(e => e.progress === 100).length}
          </div>
          <p className="text-gray-600">Completed</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-warning mb-2">
            {enrolledCourses.filter(e => e.progress > 0 && e.progress < 100).length}
          </div>
          <p className="text-gray-600">In Progress</p>
        </Card>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-semibold">Your Courses</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrolledCourses.map((enrollment) => {
            const progressStatus = getProgressStatus(enrollment.progress);
            
            return (
              <Card key={enrollment.Id} className="p-6 hover:card-shadow-hover transition-shadow">
                <div className="flex gap-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-semibold text-lg line-clamp-1">
                        {enrollment.course.title}
                      </h3>
                      <Badge variant={progressStatus.variant}>
                        {progressStatus.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      by {enrollment.course.instructor.name}
                    </p>
                    
                    <div className="mb-4">
                      <ProgressBar progress={enrollment.progress} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Clock" size={14} />
                          {enrollment.course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={14} />
                          {formatDistanceToNow(new Date(enrollment.lastAccessed), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <Link to={`/course/${enrollment.course.Id}/learn`}>
                        <Button size="sm" variant="primary">
                          {enrollment.progress === 0 ? "Start Course" : "Continue"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;