import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, getToken } from "../index.js";
import { likePost, dislikePost, deletePost } from "../api.js";
import { renderPostCard } from "./post-card.js";

export function renderPostsPageComponent({ appEl }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${posts.length
      ? `<ul class="posts">
              ${posts.map((post) => renderPostCard(post, user)).join("")}
            </ul>`
      : `<p class="empty-text">Пока нет постов. Добавьте первый!</p>`
    }
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (const userEl of appEl.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
        userName: userEl.dataset.userName,
      });
    });
  }

  for (const likeEl of appEl.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      if (!user) {
        alert("Войдите, чтобы ставить лайки");
        return;
      }
      const postId = likeEl.dataset.postId;
      const isLiked = likeEl.dataset.isLiked === "true";
      const request = isLiked ? dislikePost : likePost;

      request({ id: postId, token: getToken() })
        .then((data) => {
          const post = data.post;

          const likeImg = likeEl.querySelector("img");
          likeImg.src = post.isLiked
            ? "./assets/images/like-active.svg"
            : "./assets/images/like-not-active.svg";
          likeEl.dataset.isLiked = post.isLiked;
          likeEl.title = post.isLiked ? "Убрать лайк" : "Поставить лайк";

          const counter = likeEl
            .closest(".post-likes")
            .querySelector(".post-likes-text strong");
          counter.textContent = post.likes.length;
        })
        .catch((error) => alert(error.message));
    });
  }

  for (const deleteEl of appEl.querySelectorAll(".delete-button")) {
    deleteEl.addEventListener("click", () => {
      if (!confirm("Удалить пост?")) return;
      deletePost({ id: deleteEl.dataset.postId, token: getToken() })
        .then(() => goToPage(POSTS_PAGE))
        .catch((error) => alert(error.message));
    });
  }
}