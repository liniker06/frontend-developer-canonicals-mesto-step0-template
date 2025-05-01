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
import {createCard} from './components/card.js';
import {
    getProfileInfo,
    getInitialCards,
    updateProfileInfo,
    addNewCard,
    deleteCard,
    likeCard,
    unlikeCard,
    updateAvatar
} from './components/api.js';

// Настройки валидации
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__input-error'
};

let userId;

// DOM элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

// Попапы
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');
const popups = [editProfilePopup, addCardPopup, imagePopup, avatarPopup];

// Формы
const editProfileForm = editProfilePopup.querySelector('.popup__form');
const addCardForm = addCardPopup.querySelector('.popup__form');
const avatarForm = avatarPopup.querySelector('.popup__form');

// Поля формы редактирования профиля
const nameInput = editProfilePopup.querySelector('.popup__input_type_name');
const jobInput = editProfilePopup.querySelector('.popup__input_type_description');

// Поля формы добавления карточки
const cardNameInput = addCardPopup.querySelector('.popup__input_type_card-name');
const cardUrlInput = addCardPopup.querySelector('.popup__input_type_url');

// Поле формы обновления аватара
const avatarUrlInput = avatarPopup.querySelector('.popup__input_type_url');

// Элементы попапа с изображением
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const openImagePopup = (cardData) => {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
};

const handleLikeClick = async (cardId, newLikeStatus, updateUI) => {
    try {
        const response = newLikeStatus
            ? await likeCard(cardId)
            : await unlikeCard(cardId);

        updateUI(response.likes);
    } catch (err) {
        console.error('Ошибка при обновлении лайка:', err);
    }
};

const handleDeleteCard = async (cardId) => {
    if (!confirm('Вы уверены, что хотите удалить эту карточку?')) return;

    try {
        await deleteCard(cardId); // Не важно, что возвращает — удалили? Удаляем из DOM
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        if (cardElement) {
            cardElement.remove();
        }
    } catch (err) {
        console.error('Ошибка удаления:', err);
        if (err.message.includes('403')) {
            alert('Вы можете удалять только свои карточки');
        } else {
            alert('Не удалось удалить карточку. Попробуйте ещё раз.');
        }
    }
};


const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const initialText = submitButton.textContent;

    submitButton.textContent = 'Сохранение...';

    updateProfileInfo(nameInput.value, jobInput.value)
        .then((userData) => {
            profileTitle.textContent = userData.name;
            profileDescription.textContent = userData.about;
            closeModal(editProfilePopup);
        })
        .catch(err => console.log(err))
        .finally(() => {
            submitButton.textContent = initialText;
        });
};

const renderCard = (cardData, container, method = 'append') => {
    const card = createCard(
        cardData,
        userId,
        openImagePopup,
        handleDeleteCard
    );

    if (method === 'prepend') {
        container.prepend(card);
    } else {
        container.append(card);
    }
};

const handleAddCardFormSubmit = (evt) => {
    evt.preventDefault();

    const submitButton = evt.target.querySelector('.popup__button');
    const initialText = submitButton.textContent;
    submitButton.textContent = 'Создание...';
    submitButton.disabled = true;

    addNewCard(cardNameInput.value, cardUrlInput.value)
        .then((cardData) => {
            const cardElement = createCard(
                cardData,
                userId,
                openImagePopup,
                (cardId) => handleDeleteCard(cardId) // Только обработчик удаления
            );
            placesList.prepend(cardElement);
            addCardForm.reset();
            closeModal(addCardPopup);
        })
        .catch(err => console.error('Ошибка при добавлении карточки:', err))
        .finally(() => {
            submitButton.textContent = initialText;
            submitButton.disabled = false;
        });
};


const handleAvatarFormSubmit = (evt) => {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const initialText = submitButton.textContent;

    submitButton.textContent = 'Сохранение...';

    updateAvatar(avatarUrlInput.value)
        .then((userData) => {
            profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
            closeModal(avatarPopup);
            avatarForm.reset();
        })
        .catch(err => console.log(err))
        .finally(() => {
            submitButton.textContent = initialText;
        });
};

Promise.all([getProfileInfo(), getInitialCards()])
    .then(([userData, cards]) => {
        userId = userData._id;

        // Заполняем профиль
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

        // Рендерим карточки
        cards.forEach(cardData => {
            renderCard(cardData, placesList);
        });
    })
    .catch(err => console.log(err));

popups.forEach((popup) => {
    setupPopupCloseHandlers(popup);
    popup.classList.add('popup_is-animated');
});

profileEditButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(editProfilePopup);
});

profileAddButton.addEventListener('click', () => {
    addCardForm.reset();
    openModal(addCardPopup);
});

avatarEditButton.addEventListener('click', () => {
    avatarForm.reset();
    openModal(avatarPopup);
});

editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

enableValidation(validationSettings);