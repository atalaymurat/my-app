import axios from "axios";

const axiosOrg = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3021"}/api/org`,
  withCredentials: true,
});

export default axiosOrg;
