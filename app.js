const toDoForm = document.getElementById("to-do-form");
const taskList = document.getElementById("task-list");
const progressBar = document.getElementById("progress-bar");
const progressPercentage = document.getElementById("progress-percentage");
const darkModeToggle = document.getElementById('dark-mode-toggle');
const clearAllBtn = document.getElementById('clear-all-btn');

// Each task gets a unique ID in this array, stored in localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskCount = tasks.length;
let completedTasks = tasks.filter(task => task.completed).length;

// Initialize page with saved tasks from localStorage
loadTasksFromLocalStorage();
updateProgress();

// Handle adding a new task
toDoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskTitle = document.getElementById("task-title").value;
    const taskCategory = document.getElementById("task-category").value;
    const taskPriority = document.getElementById("task-priority").value;

    const task = {
        id: Date.now(), // Use current timestamp as unique ID
        title: taskTitle,
        category: taskCategory,
        priority: taskPriority,
        completed: false,
    };

    tasks.push(task);
    taskCount++;
    saveTasksToLocalStorage();
    addTaskToDOM(task);
    updateProgress();
    toDoForm.reset();
});

// Add task to the DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.classList.add('task', task.priority);
    li.setAttribute("data-id", task.id); // Set the unique ID as a data attribute
    
    if (task.completed) {
        li.classList.add('complete-task');
    }

    li.innerHTML = `
        <span class="task-title">${task.title} [${task.category}]</span>
        <button onclick="toggleTaskCompletion(${task.id})">Mark Complete</button> 
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
}

// Load tasks stored in localStorage
function loadTasksFromLocalStorage() {
    tasks.forEach(task => addTaskToDOM(task));
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update progress bar and percentage
function updateProgress() {
    const progress = taskCount ? (completedTasks / taskCount) * 100 : 0;
    progressBar.value = progress;
    progressPercentage.textContent = `${Math.round(progress)}%`;
}

// Complete a task
function toggleTaskCompletion(taskID) {
    const taskItem = document.querySelector(`[data-id="${taskID}"]`);
    taskItem.classList.toggle("complete-task");

    const task = tasks.find(t => t.id === taskID);
    task.completed = !task.completed;

    // Update completed task count
    if (task.completed) {
        completedTasks++;
    } else {
        completedTasks--;
    }

    saveTasksToLocalStorage();
    updateProgress();
}

// Delete an individual task
function deleteTask(taskID) {
    const taskItem = document.querySelector(`[data-id="${taskID}"]`);
    taskItem.remove();  // Remove from DOM

    // Filter out the task from the array
    tasks = tasks.filter(t => t.id !== taskID);
    taskCount--;

    // Update completed task count if necessary
    if (taskItem.classList.contains("complete-task")) {
        completedTasks--;
    }

    saveTasksToLocalStorage();
    updateProgress();
}

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        taskList.innerHTML = '';  // Clear the entire task list in the DOM
        taskCount = 0;
        completedTasks = 0;
        saveTasksToLocalStorage();
        updateProgress();
    }
});

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Load Dark Mode preference on page load
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// Attach event listener for Dark Mode button
darkModeToggle.addEventListener('click', toggleDarkMode);

// Load Dark Mode preference on page load
loadDarkModePreference();
