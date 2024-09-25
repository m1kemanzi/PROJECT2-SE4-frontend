import apiClient from "./services.js";

export default {
  getAllCourses(page = 1, limit = 20) {
    return apiClient.get(`/courses`, {
      params: {
        page: page,
        limit: limit
      }
    });
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
