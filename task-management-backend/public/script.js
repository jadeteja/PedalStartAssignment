document.addEventListener('DOMContentLoaded', () => {
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskDate = document.getElementById('task-date');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('tasks');

    const API_URL = 'http://localhost:3000/tasks';

    async function fetchTasks() {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        return tasks;
    }

    async function displayTasks() {
        const tasks = await fetchTasks();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('list-group-item');
            taskItem.innerHTML = `
                <div>
                    <h5>${task.title}</h5>
                    <p>${task.desc}</p>
                    <small>${task.date}</small>
                </div>
                <div class="task-actions">
                    <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    async function addTask() {
        const title = taskTitle.value;
        const desc = taskDesc.value;
        const date = taskDate.value;

        if (title && desc && date) {
            const newTask = { title, desc, date };
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
            displayTasks();
            taskTitle.value = '';
            taskDesc.value = '';
            taskDate.value = '';
        } else {
            alert('Please fill in all fields');
        }
    }

    addTaskBtn.addEventListener('click', addTask);

    window.editTask = async function(id) {
        const response = await fetch(`${API_URL}/${id}`);
        const task = await response.json();

        taskTitle.value = task.title;
        taskDesc.value = task.desc;
        taskDate.value = task.date;

        addTaskBtn.innerText = 'Update Task';
        addTaskBtn.classList.remove('btn-primary');
        addTaskBtn.classList.add('btn-success');
        addTaskBtn.onclick = async function() {
            updateTask(id);
        }
    }

    async function updateTask(id) {
        const updatedTask = {
            title: taskTitle.value,
            desc: taskDesc.value,
            date: taskDate.value
        };

        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        addTaskBtn.innerText = 'Add Task';
        addTaskBtn.classList.remove('btn-success');
        addTaskBtn.classList.add('btn-primary');
        addTaskBtn.onclick = addTask;
        displayTasks();
        taskTitle.value = '';
        taskDesc.value = '';
        taskDate.value = '';
    }

    window.deleteTask = async function(id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        displayTasks();
    }

    displayTasks();
});
