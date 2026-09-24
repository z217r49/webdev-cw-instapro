import { formatRelativeTime, escapeHtml } from "../helpers.js";

/**
 * Возвращает HTML-разметку карточки поста.
 * @param {Object} post - пост из API
 * @param {Object|null} currentUser - текущий авторизованный пользователь (или null)
 */
export function renderPostCard(post, currentUser) {
    const postDate = formatRelativeTime(post.createdAt);
    const likeIcon = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";
    const isOwn = currentUser && post.user.login === currentUser.login;

    return `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}" data-user-name="${escapeHtml(post.user.name)}">
        <img src="${post.user.imageUrl}" class="post-header__user-image" alt="">
        <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}" alt="">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-is-liked="${post.isLiked}" class="like-button" title="${post.isLiked ? "Убрать лайк" : "Поставить лайк"}">
          <img src="${likeIcon}" alt="Нравится">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
        ${isOwn ? `<button data-post-id="${post.id}" class="delete-button">Удалить</button>` : ""}
      </div>
      <p class="post-text">
        <span class="user-name">${escapeHtml(post.user.name)}</span>
        ${escapeHtml(post.description)}
      </p>
      <p class="post-date">${postDate}</p>
    </li>
  `;
}