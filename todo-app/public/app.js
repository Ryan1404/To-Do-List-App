let tasks = []; // Array to store tasks

// Function to fetch tasks from the server
const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:5000/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    tasks = await response.json();
    updateTasksList();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Fallback to local storage if server is unavailable
    const localTasks = localStorage.getItem('todo-tasks');
    if (localTasks) {
      tasks = JSON.parse(localTasks);
      updateTasksList();
    }
  }
};

// Function to add a new task
const addTask = async (e) => {
  e.preventDefault();

  const taskInput = document.getElementById("taskinput");
  const text = taskInput.value.trim();

  if (text) {
    try {
      // Try to add to server first
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        const newTask = await response.json();
        tasks.push(newTask);
      } else {
        // Fallback to local storage if server fails
        const task = {
          text: text,
          completed: false,
          id: Date.now() // Temporary ID for local storage
        };
        tasks.push(task);
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
      }
      
      taskInput.value = "";
      updateTasksList();
    } catch (error) {
      console.error('Error adding task:', error);
      // Fallback to local storage if fetch fails
      const task = {
        text: text,
        completed: false,
        id: Date.now() // Temporary ID for local storage
      };
      tasks.push(task);
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
      taskInput.value = "";
      updateTasksList();
    }
  }
};

// Function to toggle task completion
const toggleTaskComplete = async (index) => {
  const task = tasks[index];
  try {
    const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !task.completed }),
    });
    
    if (response.ok) {
      tasks[index].completed = !task.completed;
    } else {
      // Fallback to local storage
      tasks[index].completed = !task.completed;
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }
    
    updateTasksList();
  } catch (error) {
    console.error('Error updating task:', error);
    // Fallback to local storage
    tasks[index].completed = !task.completed;
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    updateTasksList();
  }
};

// Function to delete a task
const deleteTask = async (index) => {
  const taskId = tasks[index].id;
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      tasks.splice(index, 1);
    } else {
      // Fallback to local storage
      tasks.splice(index, 1);
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }
    
    updateTasksList();
  } catch (error) {
    console.error('Error deleting task:', error);
    // Fallback to local storage
    tasks.splice(index, 1);
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    updateTasksList();
  }
};

// Function to edit a task
const editTask = async (index) => {
  const task = tasks[index];
  const newText = prompt("Edit task:", task.text);
  
  if (newText !== null && newText.trim() !== "") {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText.trim() }),
      });
      
      if (response.ok) {
        tasks[index].text = newText.trim();
      } else {
        // Fallback to local storage
        tasks[index].text = newText.trim();
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
      }
      
      updateTasksList();
    } catch (error) {
      console.error('Error updating task:', error);
      // Fallback to local storage
      tasks[index].text = newText.trim();
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
      updateTasksList();
    }
  }
};

// Function to update the displayed task list
const updateTasksList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear the list before re-rendering

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
    listItem.querySelector(".checkbox").addEventListener("change", () => {
      toggleTaskComplete(index);
    });

    taskList.appendChild(listItem);
  });

  updateStats(); // Update stats (completed vs total tasks)
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

// Attach the form submit event to the addTask function
document.getElementById("taskForm").addEventListener("submit", addTask);

// Initial fetch of tasks when the page loads
document.addEventListener('DOMContentLoaded', fetchTasks);