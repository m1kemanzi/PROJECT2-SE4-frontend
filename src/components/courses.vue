<script setup>
import { ref, computed } from "vue";
import courseServices from "../services/courseServices.js";
import AddCourseModal from "../components/newCourse.vue";  

const courses = ref([]);
const message = ref("Search, Edit or Delete Courses");
const searchQuery = ref("");  // Add searchQuery to store the search input

const showModal = ref(false);  
const currentPage = ref(1); 
const coursesPerPage = 8;    
const maxVisiblePages = 5;  

const retrieveCourses = () => {
  courseServices.getAllCourses()
    .then((response) => {
      courses.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const filteredCourses = computed(() => {
  if (!searchQuery.value) return courses.value; // If no search, return all courses
  return courses.value.filter(course => 
    course.Name.toLowerCase().includes(searchQuery.value.toLowerCase())  // Filter by name
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage);
});

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  const end = start + coursesPerPage;
  return filteredCourses.value.slice(start, end);
});

const pageNumbers = computed(() => {
  let startPage = Math.max(currentPage.value - Math.floor(maxVisiblePages / 2), 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value);

  const hasLeftEllipsis = startPage > 1;
  if (hasLeftEllipsis) startPage++;

  const hasRightEllipsis = endPage < totalPages.value;
  if (hasRightEllipsis) endPage--;

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return {
    pages,
    hasLeftEllipsis,
    hasRightEllipsis,
  };
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  retrieveCourses();
};
  function deleteCourse(item) {
    if(confirm(`Are you sure you want to delete ${item.Name}?`)) {
      courseServices.deleteCourse(item.id)
      .then(() => {
        courses.value = courses.value.filter(course => course.id !== item.id);
        alert(`${item.Name} has been deleted succesfully!`);
        retrieveCourses();
      })
      .catch((e) => {
        message.value = e.response.data.message;
      });
    };

  }
  retrieveCourses();
  </script>


<template>
  <div class="course-container">
    <h2>Courses</h2>
    <input v-model="searchQuery" type="text" placeholder="Search courses by Name" class="search-input"/>  <!-- Search input -->
    <br>
    <button @click="openModal" class="btn btn-maroon">Add New Course</button>

    <AddCourseModal 
      :showModal="showModal" 
      @close-modal="closeModal"
    />

    <div class="container">
      <br /><br />
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedCourses" :key="item.title">
                <td>{{ item.Name }}</td>
                <td>
                  <i class="fas fa-pencil-alt mx-4" @click="editCourse(item)"></i>
                  <i class="fas fa-list-ul mx-4" @click="viewCourse(item)"></i>
                  <i class="fas fa-trash mx-4" @click="deleteCourse(item)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="arrow-button">
          <i class="fas fa-arrow-left"></i>
        </button>
        <span v-if="pageNumbers.hasLeftEllipsis" class="ellipsis">...</span>
        <button
          v-for="page in pageNumbers.pages"
          :key="page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
          class="page-button"
        >
          {{ page }}
        </button>
        <span v-if="pageNumbers.hasRightEllipsis" class="ellipsis">...</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="arrow-button">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-button,
.arrow-button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #800000;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.arrow-button {
  padding: 5px;
}

.page-button:hover,
.arrow-button:hover {
  background-color: #5c0000;
}

.page-button.active {
  background-color: #343a40;
}

.ellipsis {
  margin: 0 5px;
  color: #800000;
  font-weight: bold;
}

/* Additional style for the search input */
.search-input {
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
