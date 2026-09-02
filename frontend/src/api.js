import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiError = (e) => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x.msg || JSON.stringify(x)).join(" ");
  return e?.message || "Something went wrong";
};

export const login = (username, password) =>
  client.post("/auth/login", { username, password }).then((r) => r.data);
export const me = () => client.get("/auth/me").then((r) => r.data);

export const getStates = () => client.get("/states").then((r) => r.data);
export const getCourses = (params = {}) => client.get("/courses", { params }).then((r) => r.data);
export const getCourse = (id) => client.get(`/courses/${id}`).then((r) => r.data);
export const getPopularCities = () => client.get("/popular-cities").then((r) => r.data);
export const getContent = () => client.get("/content").then((r) => r.data);

export const createCourse = (data) => client.post("/courses", data).then((r) => r.data);
export const updateCourse = (id, data) => client.put(`/courses/${id}`, data).then((r) => r.data);
export const deleteCourse = (id) => client.delete(`/courses/${id}`).then((r) => r.data);
export const updateContent = (data) => client.put("/content", data).then((r) => r.data);
