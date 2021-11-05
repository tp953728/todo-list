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
    newTodo.draggable = 'true'
    if (todo.status > 0) {
        newTodo.classList.add('done');
    }
    list.append(newTodo)
    DnDHandlers(newTodo)
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

const items = document.querySelectorAll('li')
let dragSrc = null;

function handleDragStart(e) {
    this.classList.add('dragging')

    dragSrc = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}
function handleDragEnd(e) {
    this.classList.remove('dragging')

    items.forEach(item => {
        item.classList.remove('hover')
    })
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault()
    }
    return false
}

function handleDragEnter(e) {
    this.classList.add('hover')
}

function handleDragLeave(e) {
    this.classList.remove('hover')
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(todoList)
    if (dragSrc !== this) {
        this.parentNode.removeChild(dragSrc)
        const appendChild = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin', appendChild);
        const newChild = this.previousSibling;
        styleCleaner(this)
        DnDHandlers(newChild)
        const originalIdx = todoList.findIndex(elem => elem.todo === dragSrc.innerHTML.slice(0, -18))
        const storeStatus = todoList[originalIdx].status
        todoList.splice(originalIdx, 1)
        const idx = todoList.findIndex(elem => elem.todo === this.innerHTML.slice(0, -18))
        const temp = {
            todo: dragSrc.innerHTML.slice(0, -18),
            status: storeStatus
        }
        todoList.splice(idx, 0, temp)
        localStorage.setItem('todoList', JSON.stringify(todoList))
    }
    return false

}

function styleCleaner(item) {
    item.classList.remove('hover')
    item.classList.remove('dragging')
}

function DnDHandlers(item) {
    styleCleaner(item)
    item.addEventListener('dragstart', handleDragStart)
    item.addEventListener('dragend', handleDragEnd)
    item.addEventListener('dragenter', handleDragEnter)
    item.addEventListener('dragleave', handleDragLeave)
    item.addEventListener('dragover', handleDragOver)
    item.addEventListener('drop', handleDrop)
}

items.forEach(item => {
    DnDHandlers(item)
})