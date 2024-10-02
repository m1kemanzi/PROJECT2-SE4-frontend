<template>
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-content">
        <h3>{{ course.Name }}</h3>
        <p><strong>Course Number:</strong> {{ course.Course_number }}</p>
        <p><strong>Department:</strong> {{ course.Dept }}</p>
        <p><strong>Description:</strong> {{ course.Description }}</p>
        <p><strong>Hours:</strong> {{ course.Hours }}</p>
        <p><strong>Level:</strong> {{ course.Level }}</p>
        <button @click="$emit('close-modal')">Close</button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    course: Object,   // The selected course to display
    showModal: Boolean // Controls modal visibility
  });
  </script>
  
  <style scoped>
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);  
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  z-index: 1001; 
}

  </style>
  