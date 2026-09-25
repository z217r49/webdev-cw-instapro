const personalKey = "aldanup";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;
const usersHost = `${baseHost}/api/user`;
const uploadHost = `${baseHost}/api/upload/image`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: token ? { Authorization: token } : {},
  })
    .then((response) => {
      if (response.status === 401) throw new Error("Нет авторизации");
      return response.json();
    })
    .then((data) => data.posts);
}

export function getUserPosts({ id, token }) {
  return fetch(postsHost + "/user-posts/" + id, {
    method: "GET",
    headers: token ? { Authorization: token } : {},
  })
    .then((response) => {
      if (response.status === 401) throw new Error("Нет авторизации");
      return response.json();
    })
    .then((data) => data.posts);
}

export function addPost({ description, imageUrl, token }) {
  return fetch(postsHost, {
    method: "POST",
    headers: token ? { Authorization: token } : {},
    body: JSON.stringify({ description, imageUrl }),
  }).then((response) => {
    if (response.status === 401) throw new Error("Нет авторизации");
    if (response.status === 400) throw new Error("Некорректные данные поста");
    return response.json();
  });
}

export function likePost({ id, token }) {
  return fetch(postsHost + "/" + id + "/like", {
    method: "POST",
    headers: token ? { Authorization: token } : {},
  }).then((response) => {
    if (response.status === 401) throw new Error("Нет авторизации");
    return response.json();
  });
}

export function dislikePost({ id, token }) {
  return fetch(postsHost + "/" + id + "/dislike", {
    method: "POST",
    headers: token ? { Authorization: token } : {},
  }).then((response) => {
    if (response.status === 401) throw new Error("Нет авторизации");
    return response.json();
  });
}

export function deletePost({ id, token }) {
  return fetch(postsHost + "/" + id, {
    method: "DELETE",
    headers: token ? { Authorization: token } : {},
  }).then((response) => {
    if (response.status === 401) throw new Error("Нет авторизации");
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(usersHost + "/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  }).then((response) => {
    if (response.status === 400) throw new Error("Неверный логин или пароль");
    return response.json();
  });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(usersHost, {
    method: "POST",
    body: JSON.stringify({ login, password, name, imageUrl }),
  }).then((response) => {
    if (response.status === 400)
      throw new Error("Такой пользователь уже существует");
    return response.json();
  });
}

export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(uploadHost, {
    method: "POST",
    body: data,
  }).then((response) => response.json());
}