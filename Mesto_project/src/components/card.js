export const createCard = (cardData, handleCardClick, handleDeleteClick, handleLikeClick) => {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener('click', () => handleCardClick(cardData));
  deleteButton.addEventListener('click', handleDeleteClick);
  likeButton.addEventListener('click', handleLikeClick);

  return cardElement;
};

export const toggleLike = (evt) => {
  evt.target.classList.toggle('card__like-button_is-active');
};

export const deleteCard = (evt) => {
  evt.target.closest('.card').remove();
};