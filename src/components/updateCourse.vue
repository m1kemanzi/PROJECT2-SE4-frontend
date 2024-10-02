<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Update Course</h3>
        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label for="dept">Department:</label>
            <input v-model="localCourseData.Dept" id="dept" type="text" required />
          </div>
  
          <div class="form-group">
            <label for="course_number">Course Number:</label>
            <input v-model="localCourseData.Course_number" id="course_number" type="text" required />
          </div>
  
          <div class="form-group">
            <label for="level">Level:</label>
            <input v-model="localCourseData.Level" id="level" type="number" required />
          </div>
  
          <div class="form-group">
            <label for="hours">Hours:</label>
            <input v-model="localCourseData.Hours" id="hours" type="number" required />
          </div>
  
          <div class="form-group">
            <label for="name">Name:</label>
            <input v-model="localCourseData.Name" id="name" type="text" required />
          </div>
  
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea v-model="localCourseData.Description" id="description" required></textarea>
          </div>
  
          <button type="submit" class="btn btn-maroon" :disabled="isSubmitting">
            {{ isSubmitting ? 'Updating...' : 'Update' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="isSubmitting">Close</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import courseServices from '../services/courseServices';
  
  export default {
    name: 'UpdateCourseModal',
    props: {
      showModal: Boolean,
      courseId: Number, // Accept courseId as a prop
    },
    data() {
      return {
        localCourseData: {}, // Local data for the course
        isSubmitting: false,  // Prevents multiple submissions
      };
    },
    watch: {
      // Watch for changes in the courseId prop
      courseId: {
        immediate: true, // Call the handler immediately on component mount
        handler(newId) {
          if (newId) {
            this.fetchCourseDetails(newId); // Fetch course details when ID changes
          }
        },
      },
    },
    methods: {
      fetchCourseDetails(id) {
        courseServices.getCourse(id)
          .then(response => {
            this.localCourseData = response.data; // Set local data with fetched course details
          })
          .catch(error => {
            console.error('Error fetching course details:', error);
          });
      },
      handleUpdate() {
        if (this.isSubmitting) return; // Prevent submission if already submitting
  
        this.isSubmitting = true; // Start submission process
  
        courseServices.updateCourse(this.localCourseData.id, this.localCourseData)
          .then(response => {
            this.$emit('course-updated', response.data); // Emit the updated course data
            this.closeModal(); // Close the modal
          })
          .catch(error => {
            console.error('Error updating course:', error);
          })
          .finally(() => {
            this.isSubmitting = false; // Reset submitting flag
          });
      },
      closeModal() {
        this.$emit('close-modal'); // Emit close event to parent
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1001;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
  }
  
  .btn-maroon {
    background-color: #800000;
    color: white;
    font-weight: bold;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-maroon:hover,
  .btn-secondary:hover {
    background-color: #5c0000;
  }
  </style>
  