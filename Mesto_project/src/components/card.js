import {likeCard, unlikeCard} from './api.js';

export const createCard = (cardData, userId, handleCardClick, handleDeleteClick) => {
    const cardTemplate = document.querySelector('#card-template');
    const cardElement = cardTemplate.content.cloneNode(true).firstElementChild;

    const elements = {
        image: cardElement.querySelector('.card__image'),
        title: cardElement.querySelector('.card__title'),
        deleteBtn: cardElement.querySelector('.card__delete-button'),
        likeBtn: cardElement.querySelector('.card__like-button'),
        likeCount: cardElement.querySelector('.card__like-count')
    };

    elements.image.src = cardData.link;
    elements.image.alt = cardData.name;
    elements.title.textContent = cardData.name;
    elements.likeCount.textContent = cardData.likes.length;

    if (cardData.owner && cardData.owner._id === userId && elements.deleteBtn) {
        elements.deleteBtn.addEventListener('click', (evt) => {
            evt.stopPropagation();
            if (typeof handleDeleteClick === 'function') {
                handleDeleteClick(cardData._id);
            }
        });
    } else if (elements.deleteBtn) {
        elements.deleteBtn.style.display = 'none';
    }

    if (cardData.likes.some(like => like._id === userId)) {
        elements.likeBtn.classList.add('card__like-button_is-active');
    }

    elements.likeBtn.addEventListener('click', async () => {
        try {
            const isLiked = elements.likeBtn.classList.contains('card__like-button_is-active');
            const response = isLiked
                ? await unlikeCard(cardData._id)
                : await likeCard(cardData._id);

            elements.likeBtn.classList.toggle('card__like-button_is-active');
            elements.likeCount.textContent = response.likes.length;
        } catch (err) {
            console.error('Ошибка при обновлении лайка:', err);
        }
    });

    elements.image.addEventListener('click', () => handleCardClick(cardData));

    cardElement.setAttribute('data-card-id', cardData._id);

    return cardElement;
};