import axios from "axios";

const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3022/api/auth",
  withCredentials: true,
});

export default authInstance;