// Время (в миллисекундах) до скрытия сообщений
const REMOVE_ALERT_TIMEOUT = 5000;
// Шаблоны сообщений об ошибках
const dataErrorMessageTemplate = document.querySelector('#data-error').content.querySelector('.data-error');
const uploadSuccessMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const uploadFailureMessageTemplate = document.querySelector('#error').content.querySelector('.error');

// Возвращаем случайное целое число в заданном диапазоне
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Проверка нажата ли клавиша Esc
const isEscapeKey = (event) => event.key === 'Escape';

// Обрабатываем событие нажатия клавиши на документе
const onDocumentKeydown = (event) => {
  if (isEscapeKey(event)) { // Проверяем является ли нажатая клавиша Escape
    event.preventDefault();
    hideUploadMessage();
  }
};

// Отображаем сообщение об ошибке при загрузке данных
const showDataErrorMessage = (text = null) => {
  const dataErrorMessage = dataErrorMessageTemplate.cloneNode(true);
  if (text) {
    dataErrorMessage.querySelector('.data-error__title').textContent = text;
  }
  document.body.append(dataErrorMessage);

  setTimeout(() => {
    // Через заданное время удаляем сообщение
    dataErrorMessage.remove();
  }, REMOVE_ALERT_TIMEOUT);
};

// Выводим сообщение о загрузке фотографии
const showUploadMessage = (template, button) => {
  const uploadMessage = template.cloneNode(true);
  const uploadMessageButton = uploadMessage.querySelector(button);
  document.body.append(uploadMessage);
  uploadMessageButton.addEventListener('click', hideUploadMessage);
  uploadMessage.addEventListener('click', onMessageOverlayClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

// Отображаем сообщение об успешной загрузке фотографии
const showuUploadSuccessMessage = () => {
  showUploadMessage(uploadSuccessMessageTemplate, '.success__button');
};

// Отображаем сообщение об неудачной загрузке фотографии
const showuUploadFailureMessage = () => {
  showUploadMessage(uploadFailureMessageTemplate, '.error__button');
};

const onOverlayClick = (event, callback) => {
  if (event.currentTarget !== event.target.closest('div') && event.target === event.currentTarget) {
    callback();
  }
};

// Функция для отложенного выполнения колбэка с заданным таймаутом
const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...rest);
    }, timeoutDelay);
  };
};

function onMessageOverlayClick (event) {
  onOverlayClick(event, hideUploadMessage);
}

// Удаляем обработчик нажатия клавиши с document
function removeDocumentKeydownHandler () {
  document.body.removeEventListener('keydown', onDocumentKeydown);
}

// Скрываем сообщение о загрузке
function hideUploadMessage () {
  const existsMessage = document.querySelector('.success') || document.querySelector('.error');
  existsMessage.remove();
  removeDocumentKeydownHandler();
}

export { getRandomNumber, isEscapeKey, showDataErrorMessage, showuUploadSuccessMessage, showuUploadFailureMessage, debounce, onOverlayClick};
