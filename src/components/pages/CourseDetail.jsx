import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import RatingStars from "@/components/molecules/RatingStars";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { cartService } from "@/services/api/cartService";
import { enrollmentService } from "@/services/api/enrollmentService";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [courseData, cartItems, enrollments] = await Promise.all([
        courseService.getById(id),
        cartService.getAll(),
        enrollmentService.getAll()
      ]);
      
      if (!courseData) {
        setError("Course not found");
        return;
      }
      
      setCourse(courseData);
      setIsInCart(cartItems.some(item => item.courseId === id));
      
      const userEnrollment = enrollments.find(e => e.courseId === id);
      setEnrollment(userEnrollment);
    } catch (error) {
      console.error("Error loading course data:", error);
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await cartService.addItem(id, course.price);
      setIsInCart(true);
      toast.success("Course added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add course to cart");
    }
  };

  const handleEnrollNow = async () => {
    try {
      await enrollmentService.create({
        courseId: id,
        progress: 0,
        completedLessons: []
      });
      
      // Simulate checkout process
      await cartService.removeItem(id);
      setIsInCart(false);
      
      const updatedEnrollments = await enrollmentService.getAll();
      const newEnrollment = updatedEnrollments.find(e => e.courseId === id);
      setEnrollment(newEnrollment);
      
      toast.success("Successfully enrolled in course!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in course");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCourseData} />;
  }

  if (!course) {
    return <Error message="Course not found" onRetry={loadCourseData} />;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "BookOpen" },
    { id: "curriculum", label: "Curriculum", icon: "List" },
    { id: "instructor", label: "Instructor", icon: "User" },
    { id: "reviews", label: "Reviews", icon: "Star" }
  ];

  const getTotalLessons = () => {
    return course.sections?.reduce((total, section) => total + section.lessons.length, 0) || 0;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Course Description</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ApperIcon name="CheckCircle" size={20} className="text-success mt-0.5" />
                  <span>Master the fundamentals and advanced concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <ApperIcon name="CheckCircle" size={20} className="text-success mt-0.5" />
                  <span>Build real-world projects and applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <ApperIcon name="CheckCircle" size={20} className="text-success mt-0.5" />
                  <span>Learn industry best practices and modern techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <ApperIcon name="CheckCircle" size={20} className="text-success mt-0.5" />
                  <span>Get hands-on experience with practical exercises</span>
                </li>
              </ul>
            </div>
          </div>
        );
        
      case "curriculum":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Course Curriculum</h3>
              <span className="text-gray-600">
                {course.sections?.length || 0} sections • {getTotalLessons()} lessons • {course.duration}
              </span>
            </div>
            
            {course.sections?.map((section, index) => (
              <Card key={section.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">
                    Section {index + 1}: {section.title}
                  </h4>
                  <span className="text-sm text-gray-600">{section.totalDuration}</span>
                </div>
                
                <div className="space-y-2">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Play" size={16} className="text-primary" />
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        );
        
      case "instructor":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{course.instructor.name}</h3>
                <p className="text-gray-700">{course.instructor.bio}</p>
              </div>
            </div>
          </div>
        );
        
      case "reviews":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{course.rating}</div>
                <RatingStars rating={course.rating} size={20} />
                <p className="text-sm text-gray-600 mt-1">Course Rating</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-700">
                  Based on {course.studentsCount.toLocaleString()} student reviews
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Student"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">John Doe</span>
                      <RatingStars rating={5} size={14} />
                    </div>
                    <p className="text-gray-700 text-sm">
                      Excellent course! Very well structured and easy to follow. The instructor explains concepts clearly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge variant="accent" className="mb-4">
                {course.level}
              </Badge>
              <h1 className="text-4xl font-display font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-purple-100 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <RatingStars rating={course.rating} size={20} showRating />
                <span className="text-purple-100">
                  ({course.studentsCount.toLocaleString()} students)
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <ApperIcon name="Clock" size={16} />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Users" size={16} />
                  {course.studentsCount.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Calendar" size={16} />
                  Updated {course.lastUpdated}
                </span>
              </div>
            </div>
            
            {/* Course Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white">
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-primary">${course.price}</span>
                </div>
                
                <div className="space-y-3">
                  {enrollment ? (
                    <Link to={`/course/${id}/learn`}>
                      <Button variant="primary" size="lg" className="w-full">
                        Continue Learning
                      </Button>
                    </Link>
                  ) : isInCart ? (
                    <div className="space-y-2">
                      <Button
                        variant="accent"
                        size="lg"
                        className="w-full"
                        onClick={handleEnrollNow}
                      >
                        Enroll Now
                      </Button>
                      <Link to="/cart">
                        <Button variant="outline" size="lg" className="w-full">
                          View in Cart
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
                
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Infinity" size={16} />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Smartphone" size={16} />
                    <span>Mobile and desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Award" size={16} />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon name={tab.icon} size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="mb-8">
              {renderTabContent()}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Course Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Play" size={16} className="text-primary" />
                  <span>{getTotalLessons()} video lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Download" size={16} className="text-primary" />
                  <span>Downloadable resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="MessageCircle" size={16} className="text-primary" />
                  <span>Q&A support</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Award" size={16} className="text-primary" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{course.instructor.name}</h4>
                  <p className="text-sm text-gray-600">Course Instructor</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{course.instructor.bio}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;