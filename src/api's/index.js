import axios from "axios";

const getAuthToken = () => localStorage.getItem("token");

const company_id = "company_0336d06ff0ec4b3b9306ddc288482663";

const axiosInstance = axios.create({
  baseURL: "https://stage.api.sloovi.com/",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (data) =>
  axiosInstance({ method: "POST", url: "login", data });

export const getUserId = () =>
  axiosInstance({
    method: "GET",
    url: `https://stage.api.sloovi.com/user?company_id=${company_id}&product=outreach`,
  });

export const addTask = (data) =>
  axiosInstance({
    method: "POST",
    url: `https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b?company_id=${company_id}`,
    data,
  });

export const fetchAllTasks = () =>
  axiosInstance({
    method: "GET",
    url: `https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b?company_id=${company_id}`,
  });

export const editTask = (task_id, data) =>
  axiosInstance({
    method: "PUT",
    url: `https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${task_id}?company_id=${company_id}`,
    data,
  });

export const deleteTask = (task_id) =>
  axiosInstance({
    method: "DELETE",
    url: `https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${task_id}?company_id=${company_id}`,
  });
