// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks based on current filter
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    if (filter === 'completed' && !task.completed) return;
    if (filter === 'pending' && task.completed) return;
    
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompleted(${index})">
        <span class="task-text">${task.text}</span>
      </label>
      <button class="delete-btn" onclick="deleteTask(${index})" title="Delete task"></button>
    `;

    taskList.appendChild(li);
  });
}

// Handle filter changes
function handleFilterChange(e) {
  const filter = e.target.dataset.filter;
  
  // Update active state of filter buttons
  filterButtons.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  
  // Render tasks with selected filter
  renderTasks(filter);
}

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    tasks.push({ text: taskText, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
}

// Toggle task completion
function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  // Update the checkbox state without re-rendering the entire list
  const checkbox = taskList.children[index].querySelector('input[type="checkbox"]');
  checkbox.checked = tasks[index].completed;
}

// Delete a task with animation
function deleteTask(index) {
  const taskItem = taskList.children[index];
  taskItem.classList.add('removing');
  
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getActiveFilter());
  }, 300); // Match animation duration
}

// Get currently active filter
function getActiveFilter() {
  const activeFilter = document.querySelector('.filter-btn.active');
  return activeFilter ? activeFilter.dataset.filter : 'all';
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Add filter button event listeners
filterButtons.forEach(btn => {
  btn.addEventListener('click', handleFilterChange);
});

// Initial render
renderTasks();
