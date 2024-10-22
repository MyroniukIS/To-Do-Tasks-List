// constants declared for input button and task list area
const taskInput = document.getElementById("task-input");
const taskSection = document.getElementById("list");
const dateControl = document.getElementById("daytime");
// dateControl.value = "2017-06-01T08:30";

// const inputTask = document.getElementById("task-input").value.trim();

// listener for the Enter key - Used to add a new task
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    createTask();
  }
});

//the onclick event for the 'Add  button
document.getElementById("push").onclick = function () {
  createTask();
};

// the function that creates a task
function createTask() {
  if (taskInput.value.length == 0) {
    alert("The task field is blank. Enter a task name and try again.");
  } else {
    // this block inserts HTML that creates each task into the task area div element
    taskSection.innerHTML += `<div class="task"> <label id="taskname"> <input onclick="updateTask(this)" type="checkbox" id="check-task"> <p>${
      document.getElementById("task-input").value
    }</p> <p>${
      document.getElementById("daytime").value
    }</p> </label> <div class="delete"> <i class="uil uil-trash"></i></div></div >`;
    var current_tasks = document.querySelectorAll(".delete");
    for (var i = 0; i < current_tasks.length; i++) {
      current_tasks[i].onclick = function () {
        this.parentNode.remove();
      };
    }
    taskSection.offsetHeight >= 200
      ? taskSection.classList.add("overflow")
      : taskSection.classList.remove("overflow");
  }
  taskInput.value = "";
}

function updateTask(task) {
  let taskItem = task.parentElement.lastElementChild;
  if (task.checked) {
    taskItem.classList.add("checked");
  } else {
    taskItem.classList.remove("checked");
  }
}

// !!!!!!!!!!!!!!!!!Quiz
