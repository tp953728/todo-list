const list = document.querySelector('#todos');
const form = document.querySelector('#submitText')
const enterText = document.querySelector('#enterText');
const todoList = JSON.parse(localStorage.getItem('todoList')) || []
const todoStatus = JSON.parse(localStorage.getItem('todoStatus')) || []

const displayAll = () => {
    todoList.forEach(todo => displayTodo(todo))
}

const displayTodo = (todo) => {
    const newTodo = document.createElement('li')
    const deleteBtn = document.createElement('button');
    deleteBtn.append('X')
    newTodo.append(todo.todo)
    newTodo.append(deleteBtn)
    if (todo.status > 0) {
        newTodo.classList.add('done');
    }
    list.append(newTodo)
    deleteBtn.addEventListener('click', function (e) {
        const deleteTodo = e.target.parentElement
        deleteTodo.remove();
        todoList.splice(todoList.findIndex(
            target => target.todo === deleteTodo.firstChild.data
        ), 1)
        localStorage.setItem('todoList', JSON.stringify(todoList))
    });
}

displayAll()

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.enterText.value) {
        newTodo = {
            todo: form.elements.enterText.value,
            status: -1
        }
        displayTodo(newTodo)
        todoList.push(newTodo)
        localStorage.setItem('todoList', JSON.stringify(todoList))
        enterText.value = '';
    }
})

list.addEventListener('click', function (e) {
    const done = e.target.firstChild.data;
    if (e.target.localName === 'li') {
        e.target.classList.toggle('done');
        todoList[todoList.findIndex(
            target => target.todo === done
        )].status *= (-1)
        localStorage.setItem('todoList', JSON.stringify(todoList))
    }
})