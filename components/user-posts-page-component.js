import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, getToken, currentUserId } from "../index.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { likePost, dislikePost, deletePost } from "../api.js";
import { renderPostCard } from "./post-card.js";
import { escapeHtml } from "../helpers.js";

export function renderUserPostsPageComponent({ appEl }) {
    const viewedUser = posts[0]?.user;

    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        ${viewedUser
            ? `
            <div class="posts-user-header">
                <img class="posts-user-header__user-image" src="${viewedUser.imageUrl}" alt="">
                <p class="posts-user-header__user-name">${escapeHtml(viewedUser.name)}</p>
            </div>
            `
            : ""
        }
        ${posts.length
            ? `<ul class="posts">
                ${posts.map((post) => renderPostCard(post, user)).join("")}
            </ul>`
            : `<p class="empty-text">У пользователя пока нет постов</p>`
        }
    </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
        element: document.querySelector(".header-container"),
    });

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
                .then(() => goToPage(USER_POSTS_PAGE, { userId: currentUserId }))
                .catch((error) => alert(error.message));
        });
    }
}