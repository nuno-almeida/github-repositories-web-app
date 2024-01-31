const baseUrl = import.meta.env.VITE_FIREBASE_REALTIME_DB_URL;

export const fetchBookmarksByUserId = async (id) => {
  const response = await fetch(`https://${baseUrl}/users/${id}/bookmarks.json`);

  if (!response.ok) {
    throw new Error("Failed to retrieve bookmarks for user " + id);
  }

  const data = await response.json();
  return data || [];
};

export const updateBookmarksByUserId = async ({ id, data }) => {
  const response = await fetch(
    `https://${baseUrl}/users/${id}/bookmarks.json`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update bookmarks for user " + id);
  }

  const dataResponse = await response.json();
  return dataResponse;
};

export const fetchTopicsByUserId = async (id) => {
  const response = await fetch(`https://${baseUrl}/users/${id}/topics.json`);

  if (!response.ok) {
    throw new Error("Failed to retrieve topics for user " + id);
  }

  const data = await response.json();
  return data;
};

export const updateTopicsByUserId = async ({ id, data }) => {
  const response = await fetch(`https://${baseUrl}/users/${id}/topics.json`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update topics for user " + id);
  }

  const dataResponse = await response.json();
  return dataResponse;
};

export const fetchAuthByUserName = async (userName) => {
  const response = await fetch(`https://${baseUrl}/auth/${userName}.json`);

  if (!response.ok) {
    throw new Error("Failed to retrieve auth data for username " + userName);
  }

  const data = await response.json();
  return data;
};

export const updateAuthByUserName = async ({ userName, data }) => {
  const response = await fetch(`https://${baseUrl}/auth/${userName}.json`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update auth data for username " + userName);
  }

  const dataResponse = await response.json();
  return dataResponse;
};

export const deleteAuthByUserName = async (userName) => {
  const response = await fetch(`https://${baseUrl}/auth/${userName}.json`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete auth data for username " + userName);
  }

  const data = await response.json();
  return data;
};
