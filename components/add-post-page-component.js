import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Новый пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea id="description-input" class="textarea" placeholder="Описание поста"></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Опубликовать</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    document.getElementById("add-button").addEventListener("click", () => {
      setError("");

      const description = document
        .getElementById("description-input")
        .value.trim();

      if (!description) {
        setError("Введите описание поста");
        return;
      }

      if (!imageUrl) {
        setError("Выберите фотографию");
        return;
      }

      const button = document.getElementById("add-button");
      button.setAttribute("disabled", "true");
      button.textContent = "Публикую...";

      onAddPostClick({ description, imageUrl })
        .then(() => {
          // После успешной публикации index.js сам перейдёт на ленту
        })
        .catch((error) => {
          setError(error.message);
          button.removeAttribute("disabled");
          button.textContent = "Опубликовать";
        });
    });
  };

  render();
}