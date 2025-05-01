const config = {
    baseUrl: 'https://mesto.nomoreparties.co/a1/apf-cohort-202',
    headers: {
        authorization: '0b2e743e-d7ff-4526-8cef-0fbf32042784',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
};

function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

export const getProfileInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
        .then(checkResponse);
};

export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
        .then(checkResponse);
};

export const updateProfileInfo = (name, about) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name,
            about
        })
    })
        .then(checkResponse);
};

export const addNewCard = (name, link) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({name, link})
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        });
};

export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
        .then(res => {
            if (res.status === 403) {
                return res.json().then(data => {
                    throw new Error(data.message || 'Нет прав на удаление');
                });
            }
            if (!res.ok) {
                throw new Error(`Ошибка ${res.status}`);
            }
            return res.json(); // <- вот это
        });
};


export const likeCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: config.headers
    }).then(checkResponse);
};

export const unlikeCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: config.headers
    }).then(checkResponse);
};

export const updateAvatar = (avatarUrl) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: avatarUrl
        })
    })
        .then(checkResponse);
};