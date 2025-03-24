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

// Function to update the displayed task list
const updateTasksList = () => {
  const taskList = document.getElementById('task-list');
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
    listItem.querySelector('.checkbox').addEventListener('change', (e) => {
      tasks[index].completed = e.target.checked;
      updateTasksList(); // Re-render the updated task list
    });

    taskList.appendChild(listItem);
  });

  updateStats(); // Update stats after updating tasks
};

// Function to update progress and stats
const updateStats = () => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  document.getElementById('numbers').textContent = `${completedTasks}/${totalTasks}`;

  // Update progress bar width
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  document.getElementById('progress').style.width = `${progressPercentage}%`;
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
document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  addTask();
});
