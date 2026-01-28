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
    activeFilter = btn.dataset.filter;
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

function render() {
    todoList.innerHTML = '';
    todoList.textContent = `Todos count: ${todos.length}`;

    const visibleTodos = activeFilter === 'all' 
    ? todos 
    : todos.filter(todo => todo.timeframe === activeFilter);

    if (visibleTodos.length === 0) {
        todoList.textContent = "No tasks here yet.";
        return;
    } 
    visibleTodos.forEach((todo) => {
        const row = document.createElement('div');
        row.className = "todo";
        row.textContent = `${todo.title} [${todo.timeframe}]`;
        todoList.appendChild(row);
    });
}

render();

