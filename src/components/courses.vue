<template>
    <div class="course-container">
      <h2>Courses</h2>
      <p>Add, edit or delete courses</p>
      <button @click="addNewCourse" class="btn btn-maroon">Add New Course</button>
    </div>
  </template>
  
  <script setup>
  function addNewCourse() {
    console.log("Add New Course button clicked");
  }
  </script>
  
  <style scoped>
  .course-container {
    margin: 20px auto;
    padding: 20px;
    max-width: 1000px; 
    background-color: white; 
    border-radius: 8px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    text-align: center; 
  }
  
  
  .course-container {
    margin-top: 80px; 
  }
  
  .btn-maroon {
    background-color: #800000;
    color: white;
    font-weight: bold;
  }
  
  .btn-maroon:hover {
    background-color: #5c0000;
  }
  
  h2 {
    color: #343a40;
  }
  
  p {
    color: #6c757d;
  }
  </style>
  