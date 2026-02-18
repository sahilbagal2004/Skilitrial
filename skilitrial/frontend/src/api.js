import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.10:5000/api"
});

export default API;
const res = await API.post("/auth/login", { email, password });
