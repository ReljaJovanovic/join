/**
 * Generates the mobile board header HTML.
 * 
 * @returns {string} The HTML string for the mobile board header.
 */
function getMobileBoardHeader() {
    return `
        <div class="top-row">
            <div class="title">
                <h1 class="m-2 w-100">Board</h1>
            </div>
            <div class="AddTaskBtn" onclick="openAddTaskInBoard()">
                <p class="AddTaskBtnText">Add task</p>
                <img src="./assets/img/board/plus-button-white.svg" alt="plus">
            </div>
        </div>
        <div class="searchBar">
            <input class="search-container mt-3" id="idSearch" type="text" class="form-control"
                placeholder="Find Task" oninput="filterAndShowTask()">
        </div>
    `;
}


/**
 * Generates the desktop board header HTML.
 * 
 * @returns {string} The HTML string for the desktop board header.
 */
function getDesktopBoardHeader() {
    return `
        <div class="title">
            <h1 class="m-2 w-100">Board</h1>
        </div>
        <div class="AddTaskBtn" onclick="openAddTaskInBoard()">
            <p class="AddTaskBtnText">Add task</p>
            <img src="./assets/img/board/plus-button-white.svg" alt="plus">
        </div>
        <div class="searchBar">
            <input class="search-container mt-3" id="idSearch" type="text" class="form-control"
                placeholder="Find Task" oninput="filterAndShowTask()">
        </div>
    `;
}


/**
 * Generates the HTML template for a task.
 * 
 * @param {string} categoryClass - The CSS class representing the task category.
 * @param {Object} task - The task object containing task details.
 * @param {string} taskId - The unique identifier for the task.
 * @param {string} assignedContactsHTML - The HTML string for assigned contacts.
 * @returns {string} The HTML string for the task.
 */
function getTaskHTMLTemplate(categoryClass, task, taskId, assignedContactsHTML) {
    return `
        <div class="task-header">
            <div class="category-label ${categoryClass}">${task.category || "No category"}</div>
        </div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-description">${task.description}</p>
        <div class="task-subtasks">${renderSubtasksHTML(taskId, task.subtasks || [])}</div>
        <div class="task-footer d-flex justify-content-between align-items-center">
            <div class="assigned-contacts d-flex">
                ${assignedContactsHTML}
            </div>
            <div class="task-priority">
                ${priorityLabelHTML(task.priority)}
            </div>
        </div>
    `;
}


/**
 * Generates the HTML for a task element.
 * 
 * @param {string} taskId - The unique identifier for the task.
 * @param {Object} task - The task object containing task details.
 * @param {string} categoryHTML - The HTML string representing the task category.
 * @param {string} subtasksHTML - The HTML string for subtasks.
 * @param {string} priorityImage - The HTML string for the task priority icon.
 * @param {string} contactsHTML - The HTML string for assigned contacts.
 * @returns {string} The HTML string for the task element.
 */
function getTaskElementHTML(taskId, task, categoryHTML, subtasksHTML, priorityImage, contactsHTML) {
    return `
      <div class="task-header">
        ${categoryHTML}
        <div class="dropdown-button-task" onclick="toggleTaskDropdown(event)">
              <img src="./assets/img/board/dropdown_close.svg" alt="dropdownClose">
              <img src="./assets/img/board/dropdown_open.svg" style="display: none" alt="dropdownOpen">
              <div id="dropdownMenuTask" class="d-menu dm-hidden">
                  <p onclick="moveTaskToCategory(event, '${taskId}', 'To do')">To Do</p>
                  <p onclick="moveTaskToCategory(event, '${taskId}', 'In progress')">In Progress</p>
                  <p onclick="moveTaskToCategory(event, '${taskId}', 'Await feedback')">Await Feedback</p>
                  <p onclick="moveTaskToCategory(event, '${taskId}', 'Done')">Done</p>
              </div>
        </div>
      </div>
      <h4 class="task-title">${task.title}</h4>
      <p class="task-description">${truncateDescription(task.description)}</p>
      <div class="task-subtasks">${subtasksHTML}</div>
      <footer class="task-footer d-flex justify-content-between align-items-center">
        <div class="assigned-contacts d-flex">
          ${contactsHTML}
        </div>
        <div class="task-priority">
          ${priorityImage}
        </div>
      </footer>
    `;
}
