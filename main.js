window.addEventListener("DOMContentLoaded", () => {
    // получаем элементы со страницы
    const todo = document.querySelector(".todo");
    const todoInput = todo.querySelector("#textAdd");
    const addBtn = todo.querySelector(".todo_add");
    const todoContent = todo.querySelector(".todo-content");
    const clearAll = todo.querySelector(".todo_clear");
    const clearCompleted = todo.querySelector(".todo_clear-complited");
    const footer = document.querySelector(".footer");
    const counter = footer.querySelector(".counter");
    const tabItems = document.querySelectorAll(".footer_list li");
    // получаем задачи из localStorage
    function getTask() {
        const tasks = localStorage.getItem("tasks");
        return tasks ? JSON.parse(tasks) : [];
    }
    // сохраняем задачи в localStorage
    function saveTasks(taskObj) {
        let allTasks = getTask();
        allTasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }
    // удаляем задачу из localStorage
    function deleteTaskFromLS(taskId) {
        let allTasks = getTask();
        const taskIndex = allTasks.findIndex((task) => task.id === taskId);
        allTasks.splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
        updateTask();
    }
    // очищаем все выполненные задачи
    function clearAllDoneTasks() {
        let tasks = getTask();
        const doneTask = tasks.filter((task) => task.done);
        if (doneTask.length > 0) {
            const completedTasks = document.querySelectorAll(
                '.todo_item input[type="checkbox"]:checked'
            );
            completedTasks.forEach((task) => {
                task.parentNode.parentNode.remove();
            });
            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks.filter((task) => !task.done))
            );
            updateTask();
        }
    }
    // очищаем все задачи
    function clearAllTasks() {
        localStorage.removeItem("tasks");
        todoContent.innerHTML = "";
        counter.innerHTML = "0 tasks left";
    }
    // удаляем задачу
    function deleteTask(e) {
        const target = e.target;
        const parentEl = target.parentNode;

        if (
            target.classList.contains("todo_item-delete") &&
            parentEl.classList.contains("todo_btns")
        ) {
            const taskId = parentEl.parentNode.getAttribute("id");
            deleteTaskFromLS(taskId);
            parentEl.parentNode.remove();
        }
    }
    // обновление информации о задачи
    function updateTask() {
        const tasks = getTask();
        const remainingTasks = tasks.filter((task) => !task.done).length;
        const doneTasks = tasks.filter((task) => task.done).length;

        clearCompleted.innerHTML = `Clear completed [${doneTasks}]`;
        counter.innerHTML = `${remainingTasks} tasks left`;
        tabs();
    }
    // переключение между вкладками
    function tabs() {
        const tasks = getTask();
        const tabItems = footer.querySelectorAll(".footer_list li");

        tabItems.forEach((tab) => {
            try {
                tab.addEventListener("click", () => {
                    const activeClass = "active-tab";
                    tabItems.forEach((tab) => {
                        tab.classList.remove(activeClass);
                    });
                    tab.classList.add(activeClass);
                    const target = tab.getAttribute("data-target");
                    tasks.forEach((task) => {
                        const taskId = document.getElementById(task.id);

                        if (!taskId) {
                            return;
                        }
                        if (target === "all") {
                            taskId.style.display = "flex";
                        } else if (target === "completed") {
                            if (task.done) {
                                taskId.style.display = "flex";
                            } else {
                                taskId.style.display = "none";
                            }
                        } else {
                            if (task.done) {
                                taskId.style.display = "none";
                            } else {
                                taskId.style.display = "flex";
                            }
                        }
                    });
                });
            } catch (e) {}
        });
    }
    // создаем задачу
    function createTask(task) {
        const newTask = document.createElement("li");
        newTask.classList.add("todo_item");
        newTask.setAttribute("id", task.id);
        let checked = task.done ? "checked" : "";
        let done = task.done ? "done" : "";

        newTask.innerHTML = `
            <label class="label">
                <input type="checkbox" name="check" class="checkbox" ${checked}>
                <span class="checkbox-custom">
                <svg width="70px" height="70px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path id="check" class="checkbox_check" d="M6,25 L20,40 L44,15"></path>
                </svg>
                </span>
            </label>
            <p class="todo-text ${done}" spellcheck="false" contenteditable="false">${task.text}</p>
            <div class="todo_btns"> 
                <button class="todo_item-edit">
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="todo_item-delete">
                    <svg width="80px" height="80px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"/>
                    </svg>
                </button>
            </div>
            `;
        newTask.addEventListener("click", deleteTask);
        return newTask;
    }
    // функция проверяет уже созданные задачи при загрузке страницы
    function checkCreatedTask() {
        const tasks = getTask();
        tasks.forEach((task) => {
            const newTask = createTask(task);
            const checkBox = newTask.querySelector(".checkbox");

            todoContent.appendChild(newTask);
            newTask.addEventListener("click", deleteTask);

            if (task.done) {
                newTask.classList.add("todo_item-done");
                newTask.querySelector(".todo-text").classList.add("done");
                newTask
                    .querySelector(".checkbox_check")
                    .classList.add("checkbox_check-checked");
                checkBox.checked = true;
            } else {
                newTask.classList.remove("todo_item-done");
                newTask.querySelector(".todo-text").classList.remove("done");
                newTask
                    .querySelector(".checkbox_check")
                    .classList.remove("checkbox_check-checked");
                checkBox.checked = false;
            }
        });
        updateTask();
        editBtn();
        checkCheckbox();
    }
    // добавляем новую задачу
    function addTask(e) {
        if (e.keyCode === 13 || e.type === "click") {
            const inputText = todoInput.value.trim();
            if (inputText !== "") {
                const taskId = new Date().getTime().toString();
                saveTasks({ id: taskId, text: inputText, done: false });
                const newTask = createTask({
                    id: taskId,
                    text: inputText,
                    done: false,
                });
                todoInput.value = "";
                const firstTask = todoContent.firstChild;
                todoContent.insertBefore(newTask, firstTask);
                updateTask();
                checkCheckbox();
                editBtn();
            }
        }
    }
    // функция проверки состояния checkbox
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
                    const checkIcon = tasks.querySelector("#check");
                    if (checkbox.checked) {
                        tasks.classList.add("todo_item-done");
                        todoText.classList.add("done");
                        checkIcon.classList.add("checkbox_check-checked");
                        updateTask();
                    } else {
                        tasks.classList.remove("todo_item-done");
                        todoText.classList.remove("done");
                        checkIcon.classList.remove("checkbox_check-checked");
                        updateTask();
                    }
                } else {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                }
            });
        });
    }
    // функция показа кнопок задачи
    function showBtns(e) {
        const target = e.target;
        const parentEl = target.parentNode;
        const tasks = getTask();
        const taskId = parentEl.getAttribute("id");
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        const editBtns = document.querySelectorAll(".todo_item-edit");
        const deleteBtns = document.querySelectorAll(".todo_item-delete");

        if (parentEl.classList.contains("todo_item")) {
            const editBtn = parentEl.querySelector(".todo_item-edit");
            const delBtn = parentEl.querySelector(".todo_item-delete");

            const activeEdit = editBtn.classList.contains(
                "todo_item--btns-active"
            );
            const activeDel = delBtn.classList.contains(
                "todo_item--btns-active"
            );

            if (!activeEdit && !activeDel) {
                editBtns.forEach((btn) =>
                    btn.classList.remove("todo_item--btns-active")
                );
                deleteBtns.forEach((btn) =>
                    btn.classList.remove("todo_item--btns-active")
                );
            }
            tasks[taskIndex] = editBtn.classList.toggle(
                "todo_item--btns-active"
            );
            tasks[taskIndex] = delBtn.classList.toggle(
                "todo_item--btns-active"
            );
        } else if (!todoContent.contains(target)) {
            editBtns.forEach((btn) =>
                btn.classList.remove("todo_item--btns-active")
            );
            deleteBtns.forEach((btn) =>
                btn.classList.remove("todo_item--btns-active")
            );
        }
        document.body.addEventListener("click", (e) => {
            const btns = document.querySelectorAll(
                ".todo_item-edit, .todo_item-delete"
            );
            if (!e.target.closest(".todo_item")) {
                btns.forEach((btn) =>
                    btn.classList.remove("todo_item--btns-active")
                );
            }
        });
    }
    // функция редактирования задачи
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
    // назначаем обработчики событий для вызова функций
    todoContent.addEventListener("click", showBtns);
    tabItems.forEach((item) => item.addEventListener("click", tabs));
    // вызываем каждый раз при загрузке страницы
    checkCreatedTask();
    addBtn.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", addTask);
    clearCompleted.addEventListener("click", clearAllDoneTasks);
    clearAll.addEventListener("click", clearAllTasks);
});



/* 
если не нравиться реализация с кнопкой редактирования ее можно удалить, но оставить возможность редактирования
в функции createTask() удалить <button class="todo_item-edit">,
в функции editBtn() удалить const btnEdit..., на строке 301 заменить btnEdit на todoText,
в функции showBtns(e) удалить все что относится к editBtn
*/