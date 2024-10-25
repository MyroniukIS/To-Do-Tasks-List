// constants declared for input button and task list area
const taskInput = document.getElementById("task-input");
const taskSection = document.getElementById("list");
const dateControl = document.getElementById("daytime");

// Listener for the Enter key - Used to add a new task
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    createTask();
  }
});

// The onclick event for the 'Add' button
document.getElementById("push").onclick = function () {
  createTask();
};

// Function to save tasks to localStorage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTaskToDOM(task.text, new Date(task.deadline), task.completed);
  });
}

// The function that creates a task
function createTask() {
  const taskInputValue = taskInput.value.trim();

  if (taskInputValue.length == 0) {
    alert("The task field is blank. Enter a task name and try again.");
  } else {
    const dateTimeInput = document.getElementById("daytime").value;

    if (dateTimeInput) {
      const deadline = new Date(dateTimeInput);

      // Save task to localStorage
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push({
        text: taskInputValue,
        deadline: deadline,
        completed: false,
      });
      saveTasksToLocalStorage(tasks);

      // Add task to DOM
      addTaskToDOM(taskInputValue, deadline, false);

      // Clear input field
      taskInput.value = "";
      dateControl.value = "";
    } else {
      alert("Please select a date and time.");
    }
  }

  taskSection.offsetHeight >= 200
    ? taskSection.classList.add("overflow")
    : taskSection.classList.remove("overflow");
}

// Function to add a task to the DOM and start countdown
function addTaskToDOM(taskText, deadline, completed) {
  const taskId = `task-${Date.now()}`; // unic ID for each task
  taskSection.innerHTML += `
    <div class="task ${completed ? "completed" : ""}" id="${taskId}"> 
        <label id="taskname"> 
          <input type="checkbox" id="check-task" ${
            completed ? "checked" : ""
          } onclick="updateTask(this, '${taskText}')"> 
          <p class="${completed ? "checked" : ""}">${taskText}</p> 
          <div id="showDeadline">${deadline} </div>
        </label> 
        <div class="delete"> 
          <i class="uil uil-trash"></i>
        </div>
      </div>`;

  // Geting new element tast
  const newTaskElement = document.getElementById(taskId);

  // Adding new block for displaying countdown
  const countdownDiv = document.createElement("div");
  countdownDiv.id = "realTimeCountdown";
  newTaskElement.querySelector("#taskname").appendChild(countdownDiv);

  // FUnctional removing
  newTaskElement.querySelector(".delete").onclick = function () {
    this.parentNode.remove();
    removeTaskFromLocalStorage(taskText);
  };

  // Starting real countdown
  startRealTimeCountdown(deadline, newTaskElement, taskText);
}

// Function to calculate and display the time difference
function calculateTimeDifference(deadline, now) {
  const timeDifference = deadline - now;

  if (timeDifference <= 0) {
    return { expired: true, difference: {} };
  }

  const seconds = Math.floor((timeDifference / 1000) % 60);
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % 30);
  const months = Math.floor((timeDifference / (1000 * 60 * 60 * 24 * 30)) % 12);
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

  return {
    expired: false,
    difference: { years, months, days, hours, minutes, seconds },
  };
}

// Function to format and display the time difference
function displayTimeDifference(difference, taskElement) {
  const countdownDiv = taskElement.querySelector("#realTimeCountdown");
  countdownDiv.innerHTML = ""; // Clear previous countdown

  const timeUnits = ["years", "months", "days", "hours", "minutes", "seconds"];
  timeUnits.forEach((unit) => {
    const value = difference[unit];
    if (value >= 0) {
      const div = document.createElement("div");
      div.textContent = `${value} ${unit}`;
      countdownDiv.appendChild(div);
    }
  });

  const remainingMessage = document.createElement("div");
  remainingMessage.textContent = " left until the deadline";
  countdownDiv.appendChild(remainingMessage);
}

// Main countdown function with real-time updates and alerts
function startRealTimeCountdown(deadline, taskElement, taskText) {
  const intervalId = setInterval(() => {
    const now = new Date();

    const { expired, difference } = calculateTimeDifference(deadline, now);

    if (expired) {
      taskElement.querySelector("#showDeadline").textContent =
        "The deadline has passed!";
      alert(`The deadline for the task "${taskText}" has passed!`);
      clearInterval(intervalId);
    } else {
      displayTimeDifference(difference, taskElement);

      // Check if there are 10 minutes left
      if (
        difference.hours === 0 &&
        difference.minutes === 10 &&
        difference.seconds === 0
      ) {
        alert(`10 minutes left until the deadline for task "${taskText}"!`);
      }
    }
  }, 1000); // Update every second

  // Save interval ID so that it can be cleared later if necessary
  taskElement.dataset.intervalId = intervalId;
}

// Function to remove a task from localStorage
function removeTaskFromLocalStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter((task) => task.text !== taskText);
  saveTasksToLocalStorage(updatedTasks);
}

// Function to handle the task checkbox status (complete/incomplete)
function updateTask(task, taskText) {
  let taskElement = task.parentElement.parentElement;

  // Toggle task completion
  taskElement.classList.toggle("completed", task.checked);
  taskElement.querySelector("p").classList.toggle("checked", task.checked);

  // Update completion status in localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.map((t) => {
    if (t.text === taskText) {
      t.completed = task.checked;
    }
    return t;
  });
  saveTasksToLocalStorage(updatedTasks);
}

// Load tasks when the page is loaded
loadTasksFromLocalStorage();
