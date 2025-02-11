/**
 * Lädt und rendert das Board mit Aufgaben und Kontakten aus Firebase.
 */
async function boardRender() {
  try {
    const [tasksData, contactsData] = await fetchBoardData();
    if (!tasksData || Object.keys(tasksData).length === 0) return;
    clearTaskContainers();
    renderTasks(tasksData, contactsData);
    initializeDragAndDrop();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

/**
 * Ruft Aufgaben und Kontakte aus Firebase ab.
 * @returns {Promise<Array>} Array mit Aufgaben- und Kontaktdaten
 */
async function fetchBoardData() {
  const firebaseUrl = "https://join-5b9f0-default-rtdb.europe-west1.firebasedatabase.app";
  const [tasksResponse, contactsResponse] = await Promise.all([
    fetch(`${firebaseUrl}/tasks.json`),
    fetch(`${firebaseUrl}/users/contacts.json`),
  ]);
  if (!tasksResponse.ok || !contactsResponse.ok) throw new Error("Error fetching data");
  return [await tasksResponse.json(), await contactsResponse.json()];
}

/**
 * Löscht den Inhalt der Aufgaben-Container.
 */
function clearTaskContainers() {
  ["todo-container", "progress-container", "feedback-container", "done-container"].forEach(
    (containerId) => (document.getElementById(containerId).innerHTML = "")
  );
}

/**
 * Rendert die Aufgaben im jeweiligen Container.
 * @param {Object} tasksData - Die geladenen Aufgaben
 * @param {Object} contactsData - Die geladenen Kontakte
 */
function renderTasks(tasksData, contactsData) {
  Object.entries(tasksData).forEach(([taskId, task]) => {
    const containerId = getContainerIdByStatus(task.status);
    if (!containerId) return;
    document.getElementById(containerId).appendChild(createTaskElement(taskId, task, contactsData));
  });
}

/**
 * Erstellt ein Task-Element.
 * @param {string} taskId - Die ID der Aufgabe
 * @param {Object} task - Die Aufgabendaten
 * @param {Object} contactsData - Die geladenen Kontakte
 * @returns {HTMLElement} Das erstellte Task-Element
 */
function createTaskElement(taskId, task, contactsData) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.id = taskId;
  taskElement.setAttribute("draggable", "true");
  taskElement.setAttribute("onclick", `openModal('${taskId}')`);
  taskElement.innerHTML = getTaskHTML(taskId, task, contactsData);
  return taskElement;
}

/**
 * Generiert das HTML für eine Aufgabe.
 * @param {string} taskId - Die ID der Aufgabe
 * @param {Object} task - Die Aufgabendaten
 * @param {Object} contactsData - Die geladenen Kontakte
 * @returns {string} Das HTML der Aufgabe
 */
function getTaskHTML(taskId, task, contactsData) {
  const categoryClass = task.category ? `bc-category-label-${task.category.replace(/\s+/g, "").toLowerCase()}` : "bc-category-label-unknown";
  return `
    <div class="task-header">
      <div class="category-label ${categoryClass}">${task.category || "No category"}</div>
    </div>
    <h4 class="task-title">${task.title}</h4>
    <p class="task-description">${task.description}</p>
    <div class="task-subtasks">${renderSubtasksHTML(taskId, task.subtasks || [])}</div>
    <div class="task-footer d-flex justify-content-between align-items-center">
      <div class="assigned-contacts d-flex">
        ${renderTaskContacts(task.assignedTo || [], contactsData)}
      </div>
      <div class="task-priority">
        ${priorityLabelHTML(task.priority)}
      </div>
    </div>
  `;
}


/**
 * Checks if the provided argument is a valid non-empty array.
 *
 * @param {any} arr - The value to check.
 * @returns {boolean} Returns `true` if the argument is a non-empty array, otherwise `false`.
 */
function isValidArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
}


/**
 * Renders HTML for displaying subtasks progress.
 *
 * @param {string} taskId - The unique identifier for the task.
 * @param {Array} subtasks - An array of subtask objects to be rendered.
 * @returns {string} Returns HTML string displaying the subtasks' progress.
 */
function renderSubtasksHTML(taskId, subtasks) {
  if (!isValidArray(subtasks)) return "";

  const completedSubtasks = subtasks.filter((subtask) => subtask.isChecked).length;
  const totalSubtasks = subtasks.length;
  const progressPercentage = (completedSubtasks / totalSubtasks) * 100;

  return `
    <div class="subtasks-progress-container d-flex align-items-center">
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
      </div>
      <div class="subtasks-count">${completedSubtasks}/${totalSubtasks} Subtasks</div>
    </div>
  `;
}


/**
 * Renders HTML for displaying assigned contacts.
 *
 * @param {Array} assignedTo - An array of contact IDs or names assigned to the task.
 * @param {Object} contactsData - An object mapping contact IDs to their details (name, color, etc.).
 * @returns {string} Returns HTML string with circles representing assigned contacts.
 */
function renderTaskContacts(assignedTo = [], contactsData = {}) {
  if (!isValidArray(assignedTo)) return "";


  return assignedTo
    .map((contactIdOrName) => {
      let contact = contactsData[contactIdOrName];

      if (!contact) {
        contact = Object.values(contactsData).find((c) => c.name === contactIdOrName);
      }

      if (!contact) {
        return ``;
    }
    

      const shortName = contact.name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("");
      const backgroundColor = contact.color || "#ccc";

      return `
        <div class="contact-circle" style="background-color: ${backgroundColor};">
          <span>${shortName}</span>
        </div>
      `;
    })
    .join("");
}


/**
 * Retrieves the container ID based on the task status.
 *
 * @param {string} status - The status of the task (e.g., "To do", "In progress", etc.).
 * @returns {string|null} The ID of the corresponding container element, or null if no matching container is found.
 */
function getContainerIdByStatus(status) {
  const statusContainers = {
    "To do": "todo-container",
    "In progress": "progress-container",
    "Await feedback": "feedback-container",
    "Done": "done-container",
  };
  return statusContainers[status] || null;
}


/**
 * Generates HTML for the priority label based on the provided priority.
 *
 * @param {string} priority - The priority level of the task (e.g., "urgent", "medium", "low").
 * @returns {string} The HTML string for displaying the priority label image.
 */
function priorityLabelHTML(priority) {
  return `<img src="assets/img/general/prio-${priority}.svg" alt="${priority}">`;
}


/**
 * Event listener for when the DOM content is fully loaded.
 * It calls the `boardRender` function to load and render the tasks on the board.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await boardRender();
});

/**
 * Updates the progress bar and subtask count for a task based on the completed subtasks.
 *
 * @param {string} taskId - The ID of the task whose progress needs to be updated.
 * @param {Array} subtasks - The list of subtasks associated with the task.
 * @returns {void}
 */
function updateProgressBar(taskId, subtasks) {
  const taskElement = document.getElementById(taskId);

  if (!taskElement) {
    console.error(`Task mit ID ${taskId} nicht gefunden.`);
    return;
  }

  const completedSubtasks = subtasks.filter(subtask => subtask.isChecked).length;
  const totalSubtasks = subtasks.length;
  const progressPercentage = totalSubtasks > 0
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : 0;

  const progressBarContainer = taskElement.querySelector(".progress-bar");
  const subtasksCount = taskElement.querySelector(".subtasks-count");

  if (progressBarContainer) {
    progressBarContainer.style.width = `${progressPercentage}%`;
  }

  if (subtasksCount) {
    subtasksCount.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
}


/**
 * Updates the status of a specific task in the Firebase database.
 *
 * @param {string} taskId - The ID of the task whose status needs to be updated.
 * @param {string} newStatus - The new status to set for the task.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateTaskStatus(taskId, newStatus) {
  const firebaseUrl = `https://join-5b9f0-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;

  try {
    await fetch(firebaseUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
  }
}


async function deleteTaskOfModalCard(id) {
  try {
    await deleteTaskInDatabase(id);
    toggleDisplayModal();
    await boardRender();
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
  }
}
