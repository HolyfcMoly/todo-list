window.addEventListener("DOMContentLoaded", () => {
    const todo = document.querySelector(".todo");
    const todoInput = todo.querySelector("#textAdd");
    const addBtn = todo.querySelector(".todo_add");
    const todoContent = todo.querySelector(".todo-content");
    const clearBtn = todo.querySelector(".todo_clear");

    function getTask() {
        const tasks = localStorage.getItem("tasks");
        return tasks ? JSON.parse(tasks) : [];
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
                <span class="checkbox-custom">
                <svg width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <title>check</title>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="invisible_box" data-name="invisible box">
                      <rect width="48" height="48" fill="none"></rect>
                    </g>
                    <g id="icons_Q2" data-name="icons Q2">
                      <path d="M14.1,37.9,6.1,30a2.1,2.1,0,0,1-.2-2.7,1.9,1.9,0,0,1,3-.2l6.6,6.6L39.1,10.1a2,2,0,0,1,2.8,2.8l-25,25A1.9,1.9,0,0,1,14.1,37.9Z"></path>
                    </g>
                  </g>
                </g>
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

                const checkboxCustom = checkbox.nextElementSibling;
                const path = document.querySelector(
                    ".checkbox-custom svg path"
                );
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
                        checkboxCustom.classList.add("active");
                    } else {
                        todoText.classList.remove("done");
                        checkboxCustom.classList.remove("active");
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
                                        <span class="checkbox-custom">
                                        <svg width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                          <title>check</title>
                                          <g id="Layer_2" data-name="Layer 2">
                                            <g id="invisible_box" data-name="invisible box">
                                              <rect width="48" height="48" fill="none"></rect>
                                            </g>
                                            <g id="icons_Q2" data-name="icons Q2">
                                              <path d="M14.1,37.9,6.1,30a2.1,2.1,0,0,1-.2-2.7,1.9,1.9,0,0,1,3-.2l6.6,6.6L39.1,10.1a2,2,0,0,1,2.8,2.8l-25,25A1.9,1.9,0,0,1,14.1,37.9Z"></path>
                                            </g>
                                          </g>
                                        </g>
                                      </svg>
                                        </span>
                                    </label>
                                    <p class="todo-text" spellcheck="false">${inputText}</p>
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
