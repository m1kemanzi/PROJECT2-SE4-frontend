<script setup>
  import courseServices from "../services/courseServices.js";
  
  import { ref } from "vue";

  const courses = ref([]);
  const message = ref("Search, Edit or Delete Courses");

  const retrieveCourses = () => {
    courseServices.getAllCourses()
      .then((response) => {
        courses.value = response.data;
      })
      .catch((e) => {
        message.value = e.response.data.message;
      });
  };

  retrieveCourses();

  function addNewCourse() {
    console.log("Add New Course button clicked");
  }
  </script>

<template>

    <div class="course-container">
      <h2>Courses</h2>
      <div>
    <v-container>
      <br /><br />
      <v-card>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Actions</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in courses" :key="item.title">
              <td>{{ item.Name }}</td>
              <td>
                <i class="mdi mdi-pencil mx-4" @click="editCourse(item)"></i>
                <i class="mdi mdi-format-list-bulleted-type mx-4" @click="viewCourse(item)"></i>
                <i class="mdi mdi-trash-can mx-4" @click="deleteCourse(item)"></i>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
      <button @click="addNewCourse" class="btn btn-maroon">Add New Course</button>
    </div>
  </template>
  
  
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
  