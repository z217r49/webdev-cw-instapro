import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element }) {

  element.innerHTML = `
  <div class="page-header">
      <h1 class="logo" title="Общая лента">instapro</h1>
      <div class="header-actions">
        <button class="header-button nav-feed-button" title="Общая лента">Лента</button>
        <button class="header-button add-or-login-button">
        ${user
      ? `<div title="Добавить пост" class="add-post-sign"></div>`
      : "Войти"
    }
        </button>
        ${user
      ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
      : ""
    }
      </div>
  </div>
  `;

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".nav-feed-button").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}