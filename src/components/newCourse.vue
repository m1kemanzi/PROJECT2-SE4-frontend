<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New Course</h3>
        <form @submit.prevent="submitNewCourse">
          <div class="form-group">
            <label for="dept">Department:</label>
            <input v-model="newCourse.Dept" id="dept" type="text" required />
          </div>
  
          <div class="form-group">
            <label for="course_number">Course Number:</label>
            <input v-model="newCourse.Course_number" id="course_number" type="text" required />
          </div>
  
          <div class="form-group">
            <label for="level">Level:</label>
            <input v-model="newCourse.Level" id="level" type="number" required />
          </div>
  
          <div class="form-group">
            <label for="hours">Hours:</label>
            <input v-model="newCourse.Hours" id="hours" type="number" required />
          </div>
  
          <div class="form-group">
            <label for="name">Name:</label>
            <input v-model="newCourse.Name" id="name" type="text" required />
          </div>
  
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea v-model="newCourse.Description" id="description" required></textarea>
          </div>
  
          <button type="submit" class="btn btn-maroon">Submit</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import courseService from '../services/courseServices'; 
  
  export default {
    name: 'AddCourseModal',
    props: {
      showModal: Boolean,  
    },
    data() {
      return {
        newCourse: {
          Dept: "",
          Course_number: "",
          Level: "",
          Hours: "",
          Name: "",
          Description: ""
        },
        isSubmitting: false  
      };
    },
    methods: {
      submitNewCourse() {
        this.isSubmitting = true;  
        
        courseService.createCourse(this.newCourse)
          .then(response => {
            console.log('Course created:', response.data);
            
            this.$emit('add-course', response.data);
            
            this.resetNewCourse();
            
            this.closeModal();
            console.log()
          })
          .catch(error => {
            console.error('There was an error creating the course:', error);
          })
          .finally(() => {
            this.isSubmitting = false;  
          });
      },
      closeModal() {
        this.$emit('close-modal'); 
      },
      resetNewCourse() {
        this.newCourse = {
          Dept: "",
          Course_number: "",
          Level: "",
          Hours: "",
          Name: "",
          Description: ""
        };
      }
    }
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
  
  input, textarea {
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
  
  .btn-maroon:hover, .btn-secondary:hover {
    background-color: #5c0000;
  }
  </style>
  