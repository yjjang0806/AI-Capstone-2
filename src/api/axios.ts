import axios from "axios";

const api = axios.create({
  baseURL: "http://52.78.47.96:8080/",
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

// ✅ 회원가입 - 수정
export const signupAPI = (payload: {
  email: string;
  password: string;
  nickname: string;
  birthDate: string;
  gender: "FEMALE" | "MALE";
}) => api.post("/api/auth/signup", payload);  // ✅ baseURL 사용, 올바른 엔드포인트

// 로그인
export const loginAPI = (data: { email: string; password: string }) =>
  api.post("/api/auth/login", data);


// 이미지 업로드
export const uploadImageAPI = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/api/analysis/image", form);
};

// 피부 분석 (파일 + 설문)
export const submitAnalysisAPI = (image: File, surveyAnswers: string[]) => {
  const form = new FormData();

  form.append("file", image);

  const surveyObj: Record<string, string> = {};
  surveyAnswers.forEach((ans, idx) => {
    surveyObj[`q${idx + 1}`] = ans;
  });

  const surveyBlob = new Blob([JSON.stringify(surveyObj)], {
    type: "application/json",
  });
  form.append("survey", surveyBlob);

  return api.post("/api/analysis/image", form);
};


export default api;