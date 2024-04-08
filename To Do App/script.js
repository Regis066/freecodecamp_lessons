// Get references to various elements in the HTML document
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Retrieve task data from local storage or initialize an empty array
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {}; // Initialize a variable to hold the currently selected task

// Function to add or update a task
const addOrUpdateTask = () => {
  // Update button text
  addOrUpdateTaskBtn.innerText = "Add Task";
  // Find index of task in taskData array
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  // Create task object
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  // Add new task to beginning of taskData array or update existing task
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  // Save updated taskData to local storage, update task container, and reset inputs
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

// Function to update the task container in the HTML document
const updateTaskContainer = () => {
  // Clear tasks container
  tasksContainer.innerHTML = "";

  // Iterate through taskData array and create HTML elements for each task
  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `;
  });
};

// Function to delete a task
const deleteTask = (buttonEl) => {
  // Find index of task in taskData array
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Remove task from DOM and taskData array, then update local storage
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

// Function to edit a task
const editTask = (buttonEl) => {
  // Find index of task in taskData array
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Set currentTask to selected task and populate input fields with task data
  currentTask = taskData[dataArrIndex];
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  // Update button text and show task form
  addOrUpdateTaskBtn.innerText = "Update Task";
  taskForm.classList.toggle("hidden");
};

// Function to reset input fields and hide task form
const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

// Check if there are existing tasks and update task container if necessary
if (taskData.length !== 0) {
  updateTaskContainer();
}

// Event listeners for opening and closing task form
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  // Check if form inputs contain values and if values have been updated
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  // If form inputs contain values and values have been updated, show confirmation dialog
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset(); // Otherwise, reset input fields and hide task form
  }
});

// Event listeners for confirmation dialog buttons
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset(); // Close confirmation dialog and reset input fields
});

// Event listener for task form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  addOrUpdateTask(); // Call addOrUpdateTask function
});
