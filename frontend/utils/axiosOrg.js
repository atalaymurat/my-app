import axios from "axios";

const axiosOrg = axios.create({
  baseURL: `${(process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3022/api/auth").replace("/api/auth", "")}/api/org`,
  withCredentials: true,
});

export default axiosOrg;
