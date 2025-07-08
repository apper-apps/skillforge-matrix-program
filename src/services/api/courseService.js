import coursesData from "@/services/mockData/courses.json";
import { delay } from "@/utils/delay";

let courses = [...coursesData];

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  async searchCourses(query) {
    await delay(300);
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(query.toLowerCase())
    );
    return [...filtered];
  },

  async getCoursesByCategory(category) {
    await delay(300);
    if (category === "All") return [...courses];
    const filtered = courses.filter(course => course.category === category);
    return [...filtered];
  },

  async getPopularCourses() {
    await delay(300);
    const popular = courses
      .filter(course => course.studentsCount > 5000)
      .sort((a, b) => b.studentsCount - a.studentsCount)
      .slice(0, 8);
    return [...popular];
  },

  async getFeaturedCourses() {
    await delay(300);
    const featured = courses
      .filter(course => course.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    return [...featured];
  }
};