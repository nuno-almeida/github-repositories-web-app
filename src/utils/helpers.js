import { v4 as uuidv4 } from "uuid";

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const generateUUID = () => uuidv4().replace(/-/g, "");

export const validateEmail = (email) => {
  const isValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  if (!isValid) {
    return {
      ok: false,
      message: "Email format invalid",
    };
  }

  return {
    ok: true,
    message: "",
  };
};

export const validateUserName = (userId) => {
  if (userId.length < 3) {
    return {
      ok: false,
      message: "Username should have at least 3 characters",
    };
  }

  return {
    ok: true,
    message: "",
  };
};

export const isElementWithinViewportWidth = ({ id, additionalMargin = 60 }) => {
  const rect = document.getElementById(id).getBoundingClientRect();
  return rect.right + additionalMargin <= getDocumentWidth();
};

export const getDocumentWidth = () =>
  window.innerWidth || document.documentElement.clientWidth;
