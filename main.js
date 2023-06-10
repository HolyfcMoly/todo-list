window.addEventListener("DOMContentLoaded", () => {
    const todo = document.querySelector(".todo");
    const todoInput = todo.querySelector("#textAdd");
    const addBtn = todo.querySelector(".todo_add");
    const todoContent = todo.querySelector(".todo-content");
    const clearBtn = todo.querySelector(".todo_clear");

    function getTask() {
        const tasks = localStorage.getItem("tasks");
        if (tasks) {
            return JSON.parse(tasks);
        }
        return [];
    }

    function saveTasks(taskObj) {
        let allTasks = getTask();
        allTasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }

    function deleteTaskFromLS(taskId) {
        let allTasks = getTask();
        const taskIndex = allTasks.findIndex((task) => task.id === taskId);
        allTasks.splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }

    function clearAllTasks() {
        localStorage.removeItem("tasks");
        todoContent.innerHTML = "";
    }

    function deleteTask(e) {
        const target = e.target;
        const parentEl = target.parentNode;
        if (target.classList.contains("todo_item-delete")) {
            if (parentEl.classList.contains("todo_btns")) {
                const taskId = parentEl.parentNode.getAttribute("id");
                deleteTaskFromLS(taskId);
                parentEl.parentNode.remove();
            }
        }
    }

    function createdTasks() {
        const tasks = getTask();
        tasks.forEach((task) => {
            const newTask = document.createElement("li");
            newTask.classList.add("todo_item");
            newTask.setAttribute("id", task.id);
            let checked = task.done ? "checked" : "";
            let done = task.done ? "done" : "";

            newTask.innerHTML = `
            <label class="label">
                <input type="checkbox" name="check" class="checkbox" ${checked}>
                <span class="checkbox-custom"></span>
            </label>
            <p class="todo-text ${done}" spellcheck="false" contenteditable="false">${task.text}</p>
            <div class="todo_btns"> 
                <button class="todo_item-edit">Ed</button>
                <button class="todo_item-delete">Del</button>
            </div>
            `;

            todoContent.appendChild(newTask);
            newTask.addEventListener("click", deleteTask);

            const checkBox = newTask.querySelector(".checkbox");
            if (task.done) {
                newTask.querySelector(".todo-text").classList.add("done");
                checkBox.checked = true;
            } else {
                newTask.querySelector(".todo-text").classList.remove("done");
                checkBox.checked = false;
            }
        });
        editBtn();
        checkCheckbox();
    }
    createdTasks();

    function checkCheckbox() {
        const checkbox = todoContent.querySelectorAll(
            '.todo_item input[type="checkbox"]'
        );
        checkbox.forEach((checkbox) => {
            checkbox.addEventListener("change", (e) => {
                const tasks = checkbox.closest(".todo_item");
                const isEdit = tasks.getAttribute("contenteditable") === "true";
                if (!isEdit) {
                    const allTasks = getTask();
                    const taskIndex = allTasks.findIndex(
                        (task) => task.id === tasks.getAttribute("id")
                    );
                    allTasks[taskIndex].done = checkbox.checked;
                    localStorage.setItem("tasks", JSON.stringify(allTasks));
                    const todoText = tasks.querySelector(".todo-text");
                    if (checkbox.checked) {
                        todoText.classList.add("done");
                    } else {
                        todoText.classList.remove("done");
                    }
                } else {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                }
            });
        });
    }

    function editBtn() {
        const btnEdit = todoContent.querySelectorAll(".todo_item-edit");
        const todoText = todoContent.querySelectorAll(".todo-text");

        btnEdit.forEach((btn, index) => {
            let editMode = false;
            const taskId = btn.closest(".todo_item").getAttribute("id");
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (editMode) {
                    return;
                }
                editMode = true;
                todoText[index].setAttribute("contenteditable", true);
                todoText[index].focus();
            });
            todoText[index].addEventListener("keydown", (e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    todoText[index].setAttribute("contenteditable", true);
                    editMode = false;
                    const inputText = todoText[index].innerText.trim();
                    if (inputText !== "") {
                        const allTasks = getTask();
                        const taskIndex = allTasks.findIndex(
                            (task) => task.id === taskId
                        );
                        allTasks[taskIndex].text = inputText;
                        localStorage.setItem("tasks", JSON.stringify(allTasks));
                    }
                    todoText[index].blur();
                } else if (e.keyCode === 27) {
                    e.preventDefault();
                    editMode = false;
                    todoText[index].innerText = todoText[index].innerText;
                    todoText[index].setAttribute("contenteditable", false);
                    todoText[index].blur();
                }
            });
            todoText[index].addEventListener("blur", () => {
                editMode = false;
                const inputText = todoText[index].innerText.trim();
                if (inputText !== "") {
                    const allTasks = getTask();
                    const taskIndex = allTasks.findIndex(
                        (task) => task.id === taskId
                    );
                    allTasks[taskIndex].text = inputText;
                    localStorage.setItem("tasks", JSON.stringify(allTasks));
                }
                todoText[index].setAttribute("contenteditable", false);
            });
        });
    }
    function task(e) {
        const newTask = document.createElement("li");
        newTask.classList.add("todo_item");
        const taskId = new Date().getTime().toString();

        newTask.setAttribute("id", taskId);
        
        if (e.keyCode === 13 || e.type === "click") {
            const inputText = todoInput.value.trim();
            if (inputText !== "") {
                saveTasks({ id: taskId, text: inputText, done: false });
                newTask.innerHTML = `
                                    <label class="label">
                                        <input type="checkbox" name="check" class="checkbox">
                                        <span class="checkbox-custom"></span>
                                    </label>
                                    <p class="todo-text" spellcheck="false">${inputText}</p>
                                    <div class="todo_btns"> 
                                        <button class="todo_item-edit">Ed</button>
                                        <button class="todo_item-delete">Del</button>
                                    </div>
                                `;
                todoInput.value = "";
                todoContent.appendChild(newTask);
                newTask.addEventListener("click", deleteTask);
                checkCheckbox();
                editBtn();
            }
        }
    }
    addBtn.addEventListener("click", task);
    todoInput.addEventListener("keydown", task);
    clearBtn.addEventListener("click", clearAllTasks);
});
