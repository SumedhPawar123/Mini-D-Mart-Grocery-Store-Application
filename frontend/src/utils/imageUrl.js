const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getImageUrl = (image) => {
  if (!image) return null;

  // If backend already returned a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Remove /api from API URL
  const serverUrl = API_BASE_URL.replace(/\/api\/?$/, "");

  // Make sure there is only one /
  return `${serverUrl}/${image.replace(/^\/+/, "")}`;
};