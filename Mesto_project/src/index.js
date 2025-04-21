import addIconImg from './images/add-icon.svg';
import avatarImg from './images/avatar.jpg';
import card1Img from './images/card_1.jpg';
import card2Img from './images/card_2.jpg';
import card3Img from './images/card_3.jpg';
import closeImg from './images/close.svg';
import deleteIconImg from './images/delete-icon.svg';
import editIconImg from './images/edit-icon.svg';
import likeActiveImg from './images/like-active.svg';
import likeInactiveImg from './images/like-inactive.svg';
import logoImg from './images/logo.svg';
//
import './styles/index.css';

const initialCards = [
    {
        name: "Архыз",
        link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
        name: "Челябинская область",
        link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
        name: "Иваново",
        link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
        name: "Камчатка",
        link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
        name: "Холмогорский район",
        link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
        name: "Байкал",
        link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];
import {enableValidation} from './components/validate.js';
import {openModal, closeModal, setupPopupCloseHandlers} from './components/modal.js';
import {createCard, toggleLike, deleteCard} from './components/card.js';

// Настройки валидации
// Настройки валидации (добавляем класс неактивной кнопки)
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled', // Этот класс делает кнопку неактивной
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error'
};

// Включение валидации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  enableValidation(validationSettings);

  // Инициализация кнопок в формах
  const forms = document.querySelectorAll('.popup__form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('.popup__input');
    const button = form.querySelector('.popup__button');

    // Проверяем состояние кнопки при первой загрузке
    const hasEmptyFields = Array.from(inputs).some(input => input.value === '');
    if (hasEmptyFields) {
      button.classList.add('popup__button_disabled');
      button.disabled = true;
    }
  });
});

// DOM элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const placesList = document.querySelector('.places__list');

// Попапы
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const popups = [editProfilePopup, addCardPopup, imagePopup];

// Формы
const editProfileForm = editProfilePopup.querySelector('.popup__form');
const addCardForm = addCardPopup.querySelector('.popup__form');

// Поля формы редактирования профиля
const nameInput = editProfilePopup.querySelector('.popup__input_type_name');
const jobInput = editProfilePopup.querySelector('.popup__input_type_description');

// Поля формы добавления карточки
const cardNameInput = addCardPopup.querySelector('.popup__input_type_card-name');
const cardUrlInput = addCardPopup.querySelector('.popup__input_type_url');

// Элементы попапа с изображением
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Функция открытия попапа с изображением
const openImagePopup = (cardData) => {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
};

// Обработчик сабмита формы профиля
const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(editProfilePopup);
};

// Обработчик сабмита формы добавления карточки
const handleAddCardFormSubmit = (evt) => {
    evt.preventDefault();
    const newCard = {
        name: cardNameInput.value,
        link: cardUrlInput.value
    };

    const cardElement = createCard(
        newCard,
        openImagePopup,
        deleteCard,
        toggleLike
    );

    placesList.prepend(cardElement);
    addCardForm.reset();
    closeModal(addCardPopup);
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Включение валидации
    enableValidation(validationSettings);

    // Инициализация карточек
    initialCards.forEach((cardData) => {
        const cardElement = createCard(
            cardData,
            openImagePopup,
            deleteCard,
            toggleLike
        );
        placesList.append(cardElement);
    });

    // Инициализация попапов
    popups.forEach((popup) => {
        setupPopupCloseHandlers(popup);
        popup.classList.add('popup_is-animated');
    });

    // Обработчики кнопок
    profileEditButton.addEventListener('click', () => {
        nameInput.value = profileTitle.textContent;
        jobInput.value = profileDescription.textContent;
        openModal(editProfilePopup);
    });

    profileAddButton.addEventListener('click', () => {
        addCardForm.reset();
        openModal(addCardPopup);
    });

    // Обработчики форм
    editProfileForm.addEventListener('submit', handleProfileFormSubmit);
    addCardForm.addEventListener('submit', handleAddCardFormSubmit);
});