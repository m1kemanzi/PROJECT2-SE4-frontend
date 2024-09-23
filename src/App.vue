<script setup>
import OCLogo from "./assets/OC-Logo.png";
import CourseComponent from './components/courses.vue'; 

</script>
<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <div class="navbar-brand d-flex align-items-center">
          <img :src="OCLogo" class="oc-icon">
        </div>
        <div class="flex-grow-1 text-center">
          <span class="navbar-title">Courses App</span>
        </div>
      </div>
    </nav>

    <CourseComponent />
  </div>
</template>


<style scoped>
#app {
  font-family: Arial, sans-serif;
  color: #2c3e50;
}

.navbar {
  background-color: #343a40; 
  z-index: 1000; 
}

.container-fluid {
  display: flex;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.flex-grow-1 {
  flex-grow: 1; 
}

.navbar-title {
  color: white; 
  font-weight: bold; 
  font-size: 140%;
  padding-right: 70px;
}

.oc-icon {
  display: inline-block;
  width: 45px;
  height: 45px;
}
</style>
