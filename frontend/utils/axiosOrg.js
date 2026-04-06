import axios from "axios";
import { attachRefreshInterceptor } from "./refreshInterceptor";

const axiosOrg = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3021"}/api/org`,
  withCredentials: true,
});

attachRefreshInterceptor(axiosOrg);

export default axiosOrg;
