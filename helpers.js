export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage() {
  window.localStorage.removeItem("user");
}

export function formatRelativeTime(isoDate) {
  const date = new Date(isoDate);
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return "только что";

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return plural(diffMin, "минуту", "минуты", "минут") + " назад";

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return plural(diffHour, "час", "часа", "часов") + " назад";

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return plural(diffDay, "день", "дня", "дней") + " назад";

  return date.toLocaleDateString("ru-RU");
}

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} ${few}`;
  return `${n} ${many}`;
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}