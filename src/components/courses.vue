<script setup>
import { ref, computed } from "vue";
import courseServices from "../services/courseServices.js";
import AddCourseModal from "../components/newCourse.vue";
import CourseDetailsModal from "../components/ViewCourseModal.vue";
import UpdateCourseModal from "../components/updateCourse.vue";  // Import the update course modal

const courses = ref([]);
const message = ref("Search, Edit or Delete Courses");
const searchQuery = ref("");

const showModal = ref(false);
const showCourseModal = ref(false);  // To show course details modal
const selectedCourse = ref(null);    // To hold the selected course data
const showUpdateModal = ref(false);  // To control the visibility of the update modal
const showFilterModal = ref(false);   // Controls the visibility of the filter modal
const currentPage = ref(1);
const coursesPerPage = 8;
const maxVisiblePages = 5;

const selectedDepartments = ref([]); // Stores selected departments for filtering
const selectedLevels = ref([]);      // Stores selected levels for filtering.

const fileInput = ref(null);

// Retrieve courses from the API
const retrieveCourses = () => {
  courseServices.getAllCourses()
    .then((response) => {
      courses.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

// Compute unique list of departments from courses
const departments = computed(() => {
  const deptSet = new Set(courses.value.map(course => course.department).filter(Boolean));
  return Array.from(deptSet);
});

// Compute unique list of levels from courses
const levels = computed(() => {
  const levelSet = new Set(courses.value.map(course => course.level).filter(Boolean));
  return Array.from(levelSet);
});

// Filtered courses based on search query and selected filters
const filteredCourses = computed(() => {
  let result = courses.value;

  // Apply search filter
  if (searchQuery.value) {
    result = result.filter(course =>
      course.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Apply department filter if any departments are selected
  if (selectedDepartments.value.length > 0) {
    result = result.filter(course => selectedDepartments.value.includes(course.department));
  }

  // Apply level filter if any levels are selected
  if (selectedLevels.value.length > 0) {
    result = result.filter(course => selectedLevels.value.includes(course.level));
  }

  return result;
});

// Calculate total pages for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage);
});

// Paginate courses for display
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  const end = start + coursesPerPage;
  return filteredCourses.value.slice(start, end);
});

// Pagination number logic
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

// Page change functions
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Open and close modal functions
const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  retrieveCourses();
};

// Delete course function
function deleteCourse(item) {
  if (confirm(`Are you sure you want to delete ${item.Name}?`)) {
    courseServices.deleteCourse(item.id)
      .then(() => {
        courses.value = courses.value.filter(course => course.id !== item.id);
        alert(`${item.Name} has been deleted successfully!`);
        retrieveCourses();
      })
      .catch((e) => {
        message.value = e.response.data.message;
      });
  }
}

// Trigger file input for uploading courses
const triggerFileInput = () => {
  fileInput.value.value = ''; // Reset the input value
  fileInput.value.click();
};

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      processCSV(contents);
    };
    reader.readAsText(file);
  }
};

// Process the CSV file for courses
const processCSV = (contents) => {
  const lines = contents.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
    alert('CSV file is empty or missing data.');
    return;
  }

  const headers = lines[0].split(',').map(header => header.trim());
  const coursesToCreate = [];

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(',', 6);
    if (data.length === headers.length) {
      const course = {};
      for (let j = 0; j < headers.length; j++) {
        course[headers[j]] = data[j].trim();
      }
      coursesToCreate.push(course);
      
    } else {
      alert(`Invalid data format on line ${i + 1}.`);
      return;
    }
  }
  createCoursesSequentially(coursesToCreate);
};

// Sequentially create courses from the CSV data
const createCoursesSequentially = async (courses) => {
  let allSuccessful = true;
  const errorMessages = [];

  // Show the overlay
  document.getElementById('overlay').style.display = 'flex';

  for (const course of courses) {
    try {
      await courseServices.createCourse(course);
    } catch (e) {
      allSuccessful = false;
      const errorMessage = e.response?.data?.message || e.message || 'Unknown error';
      errorMessages.push(`Failed to import course "${course.Name}": ${errorMessage}`);
    }
  }

  // Hide the overlay
  document.getElementById('overlay').style.display = 'none';

  if (allSuccessful) {
    retrieveCourses();
    alert('Courses imported successfully!');
  } else {
    retrieveCourses(); // Refresh to show any successfully imported courses
    alert('Some courses failed to import:\n' + errorMessages.join('\n'));
  }
};

// Update filters
const onFiltersUpdated = (departments, levels) => {
  selectedDepartments.value = departments;
  selectedLevels.value = levels;
};

// View course details
const viewCourse = (course) => {
  selectedCourse.value = course;  // Assign the selected course to selectedCourse
  showCourseModal.value = true;   // Open the modal
};

// Edit course
const editCourse = (course) => {
  selectedCourse.value = course; // Set the selected course for editing
  showUpdateModal.value = true;   // Show the update modal
};

retrieveCourses();
</script>

<template>
  <div class="course-container">
    <h2>Courses</h2>
    <div class="search-and-filter">
      <input v-model="searchQuery" type="text" placeholder="Search courses by Name" class="search-input"/>
    </div>
    <div class="button-group">
      <button @click="openModal" class="btn btn-maroon">Add New Course</button>
      <button @click="triggerFileInput" class="btn btn-green">Import Courses</button>
    </div>
    <!-- Hidden file input -->
    <input type="file" ref="fileInput" accept=".csv" @change="handleFileUpload" style="display: none;"/>

    <!-- Filter Modal Component -->
    <FilterModal
      v-if="showFilterModal"
      :departments="departments"
      :levels="levels"
      :selected-departments="selectedDepartments"
      :selected-levels="selectedLevels"
      @apply-filters="onFiltersUpdated"
      @close-modal="showFilterModal = false"
    />

    <AddCourseModal 
      :showModal="showModal" 
      @close-modal="closeModal"
    />

    <CourseDetailsModal 
      v-if="showCourseModal" 
      :course="selectedCourse" 
      :showModal="showCourseModal"
      @close-modal="showCourseModal = false"
    />

    <!-- Update Course Modal -->
    <UpdateCourseModal 
      v-if="showUpdateModal" 
      :course="selectedCourse" 
      :showModal="showUpdateModal" 
      @close-modal="showUpdateModal = false"
      @course-updated="retrieveCourses"
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
              <tr v-for="item in paginatedCourses" :key="item.id">
                <td>{{ item.Name }}</td>
                <td>
                  <i class="fas fa-pencil-alt mx-4 icon-hover" @click="editCourse(item)"></i>
                  <i class="fas fa-list-ul mx-4 icon-hover" @click="viewCourse(item)"></i>
                  <i class="fas fa-trash mx-4 icon-hover" @click="deleteCourse(item)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="overlay" class="overlay" style="display: none;">
  <div class="loader"></div>
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

.btn-green {
  background-color: #008000;
  color: white;
  font-weight: bold;
}

.btn-green:hover {
  background-color: #005c00;
}

.btn-default {
  background-color: #ccc;
  color: #333;
  font-weight: bold;
}

.btn-default:hover {
  background-color: #999;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
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

.search-and-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-icon {
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.5em;
  color: #800000;
}

.filter-icon:hover {
  color: #5c0000;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Gray out effect */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it appears above other content */
}

.loader {
  border: 8px solid #f3f3f3; /* Light gray */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px; /* Size of the loader */
  height: 50px; /* Size of the loader */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.icon-hover {
  transition: color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.icon-hover:hover {
  transform: scale(1.2); /* Enlarge the icon slightly on hover */
}


</style>
