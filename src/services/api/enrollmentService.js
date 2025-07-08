import enrollmentsData from "@/services/mockData/enrollments.json";
import { delay } from "@/utils/delay";

let enrollments = [...enrollmentsData];

export const enrollmentService = {
  async getAll() {
    await delay(300);
    return [...enrollments];
  },

  async getById(id) {
    await delay(200);
    const enrollment = enrollments.find(e => e.Id === parseInt(id));
    return enrollment ? { ...enrollment } : null;
  },

  async create(enrollment) {
    await delay(300);
    const newId = Math.max(...enrollments.map(e => e.Id), 0) + 1;
    const newEnrollment = {
      ...enrollment,
      Id: newId,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      lastAccessed: new Date().toISOString(),
      completedLessons: []
    };
    enrollments.push(newEnrollment);
    return { ...newEnrollment };
  },

  async update(id, data) {
    await delay(200);
    const index = enrollments.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      enrollments[index] = { ...enrollments[index], ...data };
      return { ...enrollments[index] };
    }
    return null;
  },

  async updateProgress(courseId, lessonId, progress) {
    await delay(200);
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (enrollment) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
      enrollment.progress = progress;
      enrollment.lastAccessed = new Date().toISOString();
      return { ...enrollment };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = enrollments.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      enrollments.splice(index, 1);
      return true;
    }
    return false;
  }
};