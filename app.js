const form = document.getElementById('todoForm');
const titleInput = document.getElementById('titleInput');
const timeframeSelect = document.getElementById('timeframeSelect');
const todoList = document.getElementById('list');
const stats = document.getElementById('stats');
const tabButtons = document.querySelectorAll('.tabs button');

// Debugging: Log the selected elements
console.log({
    todoForm,
    titleInput,
    timeframeSelect,
    todoList,
    stats,
    tabButtons: tabButtons.length,
});

const STORAGE_KEY = 'todo-app:v1';

// save todos to localStorage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
        return [];
    }
}

// Function to escape HTML special characters
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[ch]));
}

//form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent page from refreshing 

    const title = titleInput.value.trim();
    const timeframe = timeframeSelect.value;

    if (!title || !timeframe) return;

    addTodo(title, timeframe);
    render();
    form.reset();
    });


tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
    render();
  });
});

//state
let todos= loadTodos();
let activeFilter = 'daily';

//filter function
function setFilter(nextFilter) {
    activeFilter = nextFilter;
    console.log('Filter set to:', activeFilter);

    tabButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === activeFilter);
    });
    
    render();
}

//add, delete, toggle functions
function addTodo(title, timeframe) {
    const todo = {
        id: Date.now().toString(), 
        title,
        timeframe,
        done: false,
    };

    todos.push(todo);
    saveTodos();
    activeFilter = timeframe;
    setFilter(activeFilter);
    render();
    console.log('Todo added:', todo);
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
}

function toggleDone(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return {...todo, done: !todo.done};
        }
        return todo;

    });
    saveTodos();
    render();
}

//Rendering function
function render() {
    todoList.innerHTML = '';

    const visibleTodos =
    activeFilter === "all"
      ? todos
      : todos.filter((todo) => todo.timeframe === activeFilter);

    if (visibleTodos.length === 0) {
        todoList.textContent = "No tasks here yet.";
        return;
    }

    visibleTodos.forEach((todo) => {
        const row = document.createElement('div');
        row.className = "todo";
        if (todo.done) row.classList.add("done");

        const left = document.createElement('div');
        left.innerHTML = `
            <div><strong>${escapeHtml(todo.title)}</strong></div>
            <div class="small">${escapeHtml(todo.timeframe)}</div>
        `;

        //done and undo
        const right = document.createElement('div');
        right.className = "row"; 
        right.style.gap = "8px";

        const doneBtn = document.createElement('button');
        doneBtn.type = "button";
        doneBtn.className = "icon-btn";
        doneBtn.textContent = todo.done ? "↩" : "✓";
        doneBtn.title = todo.done ? "Mark as not done" : "Mark as done";
        doneBtn.addEventListener("click", () => toggleDone(todo.id));
        
        //delete
        const deleteBtn = document.createElement('button');
        deleteBtn.type = "button";
        deleteBtn.className = "icon-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.title = "Delete task";
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
        
        right.appendChild(doneBtn);
        right.appendChild(deleteBtn);

        row.appendChild(left);
        row.appendChild(right);
        todoList.appendChild(row);

    });

}

window.addEventListener("click", () => {
  titleInput.focus();
}, { once: true });
render();

