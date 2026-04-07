import api from "../../services/api";

export const loginApi = (data) => {
  return api.post("/auth/login", data);
};

export const signupApi = (data) => {
  return api.post("/auth/signup", data);
};
