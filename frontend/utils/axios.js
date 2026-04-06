import axios from "axios";
import { attachRefreshInterceptor } from "./refreshInterceptor";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.100:3021",
  withCredentials: true,
});

attachRefreshInterceptor(instance);

export default instance;
