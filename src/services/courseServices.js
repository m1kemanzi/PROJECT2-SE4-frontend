import apiClient from "./services.js";

export default {
  getAllCourses() {
    return apiClient.get(`/courses/`);
  },
  getCourse(id) {
    return apiClient.get(`/courses/${id}`);
  },
  createCourse(data) {
    return apiClient.post(`/courses/`, data);
  },
  updateCourse( id, data) {
    return apiClient.put(`/courses/${id}`, data);
  },
  deleteCourse(id) {
    return apiClient.delete(`/courses/${id}`);
  },
};
