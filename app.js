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
    setFilter(btn.dataset.filter);
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

    todos.forEach((todo) => {
        const row = document.createElement('div');
        row.textContent = todo.title;
        todoList.appendChild(row);
    });
}

render();

