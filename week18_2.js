const form = document.forms.myForm;
const input = form.elements.myName;
const noTask = document.getElementById("notask");
const buttonTask = document.getElementById("taskbtn");
const buttonList = document.getElementById("listbtn");
const listContainer = document.querySelector(".info");

// Функция для получения текущего списка задач из localStorage
function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Функция для сохранения списка задач в localStorage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Функция для восстановления списка задач из localStorage
function restoreTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage();
  if (tasks.length > 0) {
    buttonList.removeAttribute("disabled");
    noTask.style.display = "none";
    tasks.forEach((task, index) => {
      const newListElement = createTaskElement(task.text, task.checked, index);
      listContainer.appendChild(newListElement);
    });
  }
}

// Функция для создания элемента задачи
function createTaskElement(text, checked, index) {
  const newListElement = document.createElement("div");
  newListElement.classList.add("info");
  newListElement.innerHTML = `
<div class="info_main">
<span class="listitem">${text}</span>
<input type="checkbox" data-index="${index}" ${checked ? "checked" : ""} />
</div>
`;
  return newListElement;
}

// Функция "Добавить задачу"
const getInfo = (evt) => {
  evt.preventDefault();

  const inputValue = input.value.trim();

  if (inputValue === "") {
    alert("Введите текст задачи!");
    return;
  }

  buttonList.removeAttribute("disabled");
  noTask.style.display = "none";

  const newListElement = createTaskElement(
    inputValue,
    false,
    listContainer.children.length
  );
  listContainer.appendChild(newListElement);

  input.value = "";

  // Получаем текущий список задач из localStorage
  const tasks = getTasksFromLocalStorage();
  // Добавляем новую задачу в список
  tasks.push({ text: inputValue, checked: false });
  // Сохраняем обновленный список задач в localStorage
  saveTasksToLocalStorage(tasks);
};

// Функция для обновления состояния задачи в localStorage
function updateTaskState(index, checked) {
  const tasks = getTasksFromLocalStorage();
  tasks[index].checked = checked;
  saveTasksToLocalStorage(tasks);
}

// Функция "Удалить задачу"
const removeInfo = (evt) => {
  evt.preventDefault();
  listContainer.innerHTML = "";
  buttonList.setAttribute("disabled", "Не работает");
  noTask.style.display = "block";

  // Очищаем localStorage
  localStorage.removeItem("tasks");
};

// На кнопку "Добавить" вешаем добавление задач
buttonTask.addEventListener("click", getInfo);

// На кнопку "Очистить" вешаем удаление задач
buttonList.addEventListener("click", removeInfo);

// При загрузке страницы восстанавливаем список задач из localStorage
document.addEventListener("DOMContentLoaded", restoreTasksFromLocalStorage);

// На родительский элемент списка задач вешаем обработчик события для обновления состояния задачи в localStorage
listContainer.addEventListener("change", function (evt) {
  if (evt.target.matches('input[type="checkbox"]')) {
    const index = evt.target.dataset.index;
    const checked = evt.target.checked;
    updateTaskState(index, checked);
  }
});
