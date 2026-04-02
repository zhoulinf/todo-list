import axios from "axios";

interface Response<T> {
  code: number;
  message: string;
  data: T;
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

http.interceptors.response.use(
  (response) => {
    const res = response.data as Response<unknown>;
    if (res.code !== 0) {
      const errMsg = res.message || "请求失败";
      return Promise.reject(new Error(errMsg));
    }
    // 直接返回业务 data，调用方无需再解包
    response.data = res.data;
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "网络异常";
    return Promise.reject(new Error(message));
  }
);
