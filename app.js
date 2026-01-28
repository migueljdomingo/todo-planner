const form = document.getElementById('todoForm');
const titleInput = document.getElementById('titleInput');
const timeframeSelect = document.getElementById('timeframeSelect');
const todoList = document.getElementById('list');
const stats = document.getElementById('stats');
const tabButtons = document.querySelectorAll('.tabs button');

console.log({
    todoForm,
    titleInput,
    timeframeSelect,
    todoList,
    stats,
    tabButtons: tabButtons.length,
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[ch]));
}

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

let todos= [];
let activeFilter = 'daily';

function setFilter(nextFilter) {
    activeFilter = nextFilter;
    console.log('Filter set to:', activeFilter);

    tabButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === activeFilter);
    });
    
    render();
}

function addTodo(title, timeframe) {
    const todo = {
        id: Date.now().toString(), 
        title,
        timeframe,
        done: false,
    };

    todos.push(todo);
    console.log('Todo added:', todo);
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    render();
}

function toggleDone(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return {...todo, done: !todo.done};
        }
        return todo;

    });
    render();
}

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

render();

