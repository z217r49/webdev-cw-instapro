import { uploadImage } from "../api.js";

// Сжимает изображение до maxSize по большей стороне и возвращает Blob (JPEG)
function compressImage(file, maxSize = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Не удалось сжать изображение"));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Не удалось прочитать изображение"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

/**
 * Компонент загрузки изображения.
 * Позволяет выбрать файл, сжимает его и загружает в облако, показывая превью.
 */
export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = "";

  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${imageUrl
        ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
        : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                accept="image/*"
                style="display:none"
              />
              Выберите фото
            </label>
          `
      }
      </div>
    `;

    // Обработчик выбора файла
    const fileInputElement = element.querySelector(".file-upload-input");
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const labelEl = document.querySelector(".file-upload-label");
        labelEl.setAttribute("disabled", true);
        labelEl.textContent = "Загружаю файл...";

        // Сжимаем изображение, чтобы не превысить лимит размера загрузки
        compressImage(file)
          .then((compressed) => uploadImage({ file: compressed }))
          .then(({ fileUrl }) => {
            imageUrl = fileUrl; // Сохраняем URL загруженного изображения
            onImageUrlChange(imageUrl); // Уведомляем об изменении URL
            render(); // Перерисовываем компонент с превью
          })
          .catch((error) => {
            labelEl.removeAttribute("disabled");
            labelEl.textContent = "Выберите фото";
            alert(error.message);
          });
      }
    });

    // Обработчик удаления изображения
    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}