let tasks = []; // Array to store tasks

// Function to add a new task
const addTask = () => {
  const taskInput = document.getElementById("taskinput");
  const text = taskInput.value.trim();

  if (text) {
    tasks.push({ text: text, completed: false });
    taskInput.value = ""; // Clear input after adding task
    updateTasksList();
  }
};

// Function to toggle task completion
const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTasksList(); // Re-render task list
};

// Function to update the displayed task list
const updateTasksList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear previous tasks

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <div class="taskitem">
        <div class="task">
          <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
          <p>${task.text}</p>
        </div>
        <div class="icons">
          <img src="./img/edit.png" onclick="editTask(${index})">
          <img src="./img/bin.png" onclick="deleteTask(${index})">
        </div>
      </div>
    `;

    // Event listener for checkbox to toggle completion status
    listItem.querySelector(".checkbox").addEventListener("change", (e) => {
      tasks[index].completed = e.target.checked;
      updateTasksList(); // Re-render the updated task list
    });

    taskList.appendChild(listItem);
  });

  updateStats(); // Update stats after updating tasks
};

// Function to update progress and stats
const updateStats = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  document.getElementById("numbers").textContent = `${completedTasks}/${totalTasks}`;

  // Update progress bar width
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  document.getElementById("progress").style.width = `${progressPercentage}%`;

  // Check if all tasks are completed and trigger confetti
  if (totalTasks > 0 && completedTasks === totalTasks) {
    blaskconfetti();
  }
};

// Function to delete a task
const deleteTask = (index) => {
  tasks.splice(index, 1); // Remove task from array
  updateTasksList(); // Update UI
};

// Function to edit a task
const editTask = (index) => {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    updateTasksList();
  }
};

// Prevent form from refreshing the page on submit
document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});

// Confetti function when all tasks are completed
const blaskconfetti = () => {
  const duration = 5 * 1000, // 5 seconds
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};
