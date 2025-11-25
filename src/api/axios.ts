// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: false,
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData면 Content-Type 제거해서 브라우저가 자동 설정하게
    if (config.data instanceof FormData) {
      delete (config.headers as any)["Content-Type"];
    } else if (config.headers) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      alert("로그인이 필요합니다.");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 회원가입
export const signupAPI = (data: {
  email: string;
  password: string;
  nickname?: string;
  birthDate?: string;
  gender?: string;
}) => api.post("/auth/signup", data);

// 로그인
export const loginAPI = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

// 피부 분석 (이미지 + 설문)
export const submitAnalysisAPI = (image: File, surveyAnswers: string[]) => {
  const form = new FormData();
  form.append("image_url", image);
  form.append("survey", JSON.stringify(surveyAnswers));

  return api.post("/analysis/image", form);
};

export default api;
