import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/molecules/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { enrollmentService } from "@/services/api/enrollmentService";

const VideoPlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [courseData, enrollmentData] = await Promise.all([
        courseService.getById(id),
        enrollmentService.getAll()
      ]);
      
      if (!courseData) {
        setError("Course not found");
        return;
      }
      
      setCourse(courseData);
      
      const userEnrollment = enrollmentData.find(e => e.courseId === id);
      setEnrollment(userEnrollment);
      
      // Set first lesson as current
      if (courseData.sections && courseData.sections.length > 0) {
        const firstLesson = courseData.sections[0].lessons[0];
        setCurrentLesson(firstLesson);
        setDuration(parseDuration(firstLesson.duration));
      }
    } catch (error) {
      console.error("Error loading course data:", error);
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const parseDuration = (durationStr) => {
    const [minutes, seconds] = durationStr.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentTime(0);
    setDuration(parseDuration(lesson.duration));
    setIsPlaying(false);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || !enrollment) return;
    
    try {
      const completedLessons = [...enrollment.completedLessons];
      if (!completedLessons.includes(currentLesson.id)) {
        completedLessons.push(currentLesson.id);
      }
      
      // Calculate progress
      const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
      const progress = Math.round((completedLessons.length / totalLessons) * 100);
      
      const updatedEnrollment = await enrollmentService.update(enrollment.Id, {
        completedLessons,
        progress,
        lastAccessed: new Date().toISOString()
      });
      
      setEnrollment(updatedEnrollment);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">
            <ApperIcon name="Loader" size={48} className="animate-spin mx-auto mb-4" />
            <p>Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <div className="text-center text-white">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={loadCourseData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
          <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            {/* Video placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <ApperIcon name="Play" size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  {currentLesson?.title || "Select a lesson"}
                </h3>
                <p className="text-gray-400">
                  {currentLesson?.duration || "No lesson selected"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="bg-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">
              {currentLesson?.title || "Select a lesson"}
            </h2>
            <Button
              onClick={handleMarkComplete}
              variant="accent"
              size="sm"
              disabled={!currentLesson || (enrollment?.completedLessons?.includes(currentLesson.id))}
            >
              {enrollment?.completedLessons?.includes(currentLesson?.id) ? "Completed" : "Mark Complete"}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handlePlayPause}
              variant="primary"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
            </Button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-white text-sm">{formatTime(currentTime)}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Sidebar */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-display font-semibold text-lg mb-2">{course?.title}</h3>
          {enrollment && (
            <ProgressBar progress={enrollment.progress} />
          )}
        </div>

        <div className="p-4 space-y-4">
          {course?.sections?.map((section) => (
            <Card key={section.id} className="p-3">
              <h4 className="font-semibold text-secondary mb-2">{section.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{section.totalDuration}</p>
              
              <div className="space-y-2">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      currentLesson?.id === lesson.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{lesson.title}</span>
                      <div className="flex items-center gap-2">
                        {enrollment?.completedLessons?.includes(lesson.id) && (
                          <ApperIcon name="CheckCircle" size={16} className="text-success" />
                        )}
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;