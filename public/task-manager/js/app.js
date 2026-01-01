// App State
let tasks = [];
let filter = 'all';

// DOM Elements
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const pendingCount = document.getElementById('pending-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskSearch = document.getElementById('task-search');
const emptyState = document.getElementById('empty-state');
const themeToggle = document.getElementById('theme-toggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    initSortable();
    initTheme();
});

// Fetch Tasks from API
async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks');
        tasks = await res.json();
        renderTasks();
    } catch (err) {
        showToast('Error loading tasks', 'error');
    }
}

// Add Task
async function addTask() {
    const text = newTaskInput.value.trim();
    if (!text) return;

    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: text })
        });

        if (res.ok) {
            const newTask = await res.json();
            tasks.push(newTask);
            renderTasks();
            newTaskInput.value = '';
            showToast('Task added successfully');
        }
    } catch (err) {
        showToast('Failed to add task', 'error');
    }
}

// Toggle Complete
async function toggleComplete(id, completed) {
    try {
        // Optimistic UI update
        const taskIndex = tasks.findIndex(t => t.id === id);
        tasks[taskIndex].completed = completed;
        renderTasks();

        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
    } catch (err) {
        showToast('Update failed', 'error');
    }
}

// Delete Task
async function deleteTask(id) {
    try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        showToast('Task deleted');
    } catch (err) {
        showToast('Delete failed', 'error');
    }
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';

    // Filter
    let filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    // Search
    const query = taskSearch.value.toLowerCase();
    if (query) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(query)
        );
    }

    // Empty State
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Stats
    const pending = tasks.filter(t => !t.completed).length;
    pendingCount.textContent = `${pending} task${pending !== 1 ? 's' : ''} left`;

    // Build List
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-content" contenteditable="false">${escapeHtml(task.title)}</span>
            <div class="task-actions">
                <button class="action-btn edit" title="Edit"><i class="fas fa-pen"></i></button>
                <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Event Listeners for Item
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleComplete(task.id, checkbox.checked));

        const deleteBtn = li.querySelector('.delete');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        const editBtn = li.querySelector('.edit');
        const contentSpan = li.querySelector('.task-content');

        editBtn.addEventListener('click', () => {
            const isEditing = contentSpan.isContentEditable;

            if (isEditing) {
                // Save
                contentSpan.contentEditable = "false";
                editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                li.classList.remove('editing');
                updateTaskTitle(task.id, contentSpan.innerText);
            } else {
                // Edit mode
                contentSpan.contentEditable = "true";
                contentSpan.focus();
                editBtn.innerHTML = '<i class="fas fa-save"></i>';
                li.classList.add('editing');
            }
        });

        // Save on Enter key
        contentSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                editBtn.click();
            }
        });

        taskList.appendChild(li);
    });
}

// Update Title
async function updateTaskTitle(id, newTitle) {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
        });
        const task = tasks.find(t => t.id === id);
        if (task) task.title = newTitle;
    } catch (err) {
        showToast('Update failed', 'error');
    }
}

// Clear Completed
clearCompletedBtn.addEventListener('click', async () => {
    const completedTasks = tasks.filter(t => t.completed);

    for (const task of completedTasks) {
        await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
    }

    tasks = tasks.filter(t => !t.completed);
    renderTasks();
});

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

taskSearch.addEventListener('input', renderTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        renderTasks();
    });
});

// Toast Notification
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.borderColor = type === 'error' ? '#ff4757' : 'var(--success)';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Theme
function initTheme() {
    const isLight = localStorage.getItem('task-theme') === 'light';
    if (isLight) {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('task-theme', isLight ? 'light' : 'dark');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Sortable (Drag & Drop)
function initSortable() {
    new Sortable(taskList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: async function () {
            // Get new order
            const newOrderIds = Array.from(taskList.children).map(li => li.getAttribute('data-id'));

            // Reorder 'tasks' array to match
            const reorderedTasks = newOrderIds.map(id => tasks.find(t => t.id === id));
            tasks = reorderedTasks;

            // Save new order to backend
            await fetch('/api/tasks/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: reorderedTasks })
            });
        }
    });
}

// Utils
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}
