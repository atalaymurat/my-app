import axios from "axios";

const authInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3021"}/api/auth`,
  withCredentials: true,
});

export default authInstance;