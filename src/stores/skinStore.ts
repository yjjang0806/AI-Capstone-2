import { defineStore } from "pinia";
import axios from "axios";

export interface Indices {
  oil: number;
  dry: number;
  sensitivity: number;
  wrinkle: number;
  pigment: number;
}

export interface VisionDetail {
  score: number;
  reason: string;
}

export interface VisionRaw {
  acne: VisionDetail;
  redness: VisionDetail;
  melasma_darkspots: VisionDetail;
}

export interface SkinResult {
  skinMbtiType: string;
  skinType: string;
  headline: string;
  skinDescription: string;
  whiteListIngredients: string[];
  whiteListRecommendation: string;
  blackListIngredients: string[];
  indices: Indices;
  visionRaw: VisionRaw;
  measuredAt: string;
  imageUrl: string;
}

export interface Product {
  productId: string;
  productName: string;
  brand: string;
  salePrice: number;
  averageReviewScore: number;
  totalReviewCount: number;
  category: string;
  imageUrl: string;
  tags?: string[];
}

interface SkinState {
  currentResult: SkinResult | null;

  // 분석에 필요한 데이터
  facePreviewUrl: string | null;
  faceFile: File | null;
  surveyAnswers: string[];

  // 추천
  recommendations: Product[];
  loadingAnalysis: boolean;
  loadingRecommendations: boolean;

  favorites: string[];
}

const RESULT_KEY = "vegin_skin_result";
const FACE_KEY = "vegin_face_preview";
const FAV_KEY = "vegin_favorites";

export const useSkinStore = defineStore("skin", {
  state: (): SkinState => ({
    currentResult: null,
    facePreviewUrl: null,
    faceFile: null,
    surveyAnswers: [],

    recommendations: [],
    loadingAnalysis: false,
    loadingRecommendations: false,

    favorites: [],
  }),

  getters: {
    // 카테고리별 추천 리스트
    skinToner(state): Product[] {
      return state.recommendations.filter((p) =>
        ["skintoner", "toner", "skin"].includes(p.category),
      );
    },
    ampoule(state): Product[] {
      return state.recommendations.filter((p) =>
        ["ampoule", "serum", "essence"].includes(p.category),
      );
    },
    lotionCream(state): Product[] {
      return state.recommendations.filter((p) =>
        ["cream", "lotion"].includes(p.category),
      );
    },
    isFavorite: (state) => (id: string) => state.favorites.includes(id),
  },

  actions: {
    /* 얼굴 파일 저장 (Camera에서 호출) */
    setFaceImage(file: File, previewUrl: string) {
      this.faceFile = file;
      this.facePreviewUrl = previewUrl;
      try {
        localStorage.setItem(FACE_KEY, previewUrl);
      } catch {}
    },

    loadFacePreviewFromStorage() {
      try {
        const v = localStorage.getItem(FACE_KEY);
        if (v) this.facePreviewUrl = v;
      } catch {}
    },

    setSurveyAnswers(answers: string[]) {
      this.surveyAnswers = answers;
    },

    saveResult(result: SkinResult) {
      this.currentResult = result;
      try {
        localStorage.setItem(RESULT_KEY, JSON.stringify(result));
      } catch {}
    },

    loadResultFromStorage() {
      try {
        const raw = localStorage.getItem(RESULT_KEY);
        if (raw) {
          this.currentResult = JSON.parse(raw) as SkinResult;
        }
        this.loadFacePreviewFromStorage();
      } catch {}
    },

    loadFavoritesFromStorage() {
      try {
        const raw = localStorage.getItem(FAV_KEY);
        if (raw) this.favorites = JSON.parse(raw) as string[];
      } catch {}
    },

    saveFavoritesToStorage() {
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(this.favorites));
      } catch {}
    },

    toggleFavorite(id: string) {
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter((x) => x !== id);
      } else {
        this.favorites.push(id);
      }
      this.saveFavoritesToStorage();
      // 필요하면 /api/favorites 호출
    },

    /* 🔥 핵심: 분석 API 호출 */
    async analyzeSkin() {
      if (!this.faceFile) {
        throw new Error("얼굴 이미지가 없습니다. 다시 촬영해주세요.");
      }

      this.loadingAnalysis = true;
      try {
        const form = new FormData();
        form.append("image_url", this.faceFile);
        form.append("survey", JSON.stringify({ answers: this.surveyAnswers }));

        const { data } = await axios.post("/api/analysis/image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const d = data.data;

        const today = new Date();
        const measuredAt = `${today.getFullYear()}.${String(
          today.getMonth() + 1,
        ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

        const result: SkinResult = {
          skinMbtiType: d.skinMbtiType,
          skinType: d.skinType,
          headline: d.headline,
          skinDescription: d.skinDescription,
          whiteListIngredients: d.whiteListIngredients ?? [],
          whiteListRecommendation: d.whiteListRecommendation ?? "",
          blackListIngredients: d.blackListIngredients ?? [],
          indices: d.indices,
          visionRaw: d.visionRaw,
          measuredAt,
          imageUrl: d.imageUrl,
        };

        this.currentResult = result;
        this.saveResult(result);

        // 추천 제품 (A 방식: 백엔드 한 번에 내려줌)
        const recList: Product[] = (d.recommendations || []).map((p: any) => ({
          productId: p.product_id ?? p.productId,
          productName: p.productName,
          brand: p.brand,
          salePrice: p.salePrice,
          averageReviewScore: p.averageReviewScore,
          totalReviewCount: p.totalReviewCount,
          category: p.category,
          imageUrl: p.image_url ?? p.imageUrl,
        }));

        this.recommendations = recList;
      } finally {
        this.loadingAnalysis = false;
      }
    },

    /* Home 진입 시 호출하면 됨 (마이페이지 최근 결과용) */
    async fetchLatestFromMyPage() {
      try {
        const { data } = await axios.get("/api/mypage");

        const latestAnalysis = data.data?.analysis?.[0];
        const latestRecommend = data.data?.recommendation;

        if (latestAnalysis && latestRecommend) {
          const today = new Date(latestAnalysis.createdAt);
          const measuredAt = `${today.getFullYear()}.${String(
            today.getMonth() + 1,
          ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

          this.currentResult = {
            skinMbtiType: latestRecommend.skinMbtiType,
            skinType: data.data.profile?.skinType ?? "",
            headline: "",
            skinDescription: "",
            whiteListIngredients: [],
            whiteListRecommendation: "",
            blackListIngredients: [],
            indices: { oil: 1, dry: 1, sensitivity: 1, wrinkle: 1, pigment: 1 },
            visionRaw: {
              acne: { score: 0, reason: "" },
              redness: { score: 0, reason: "" },
              melasma_darkspots: { score: 0, reason: "" },
            },
            measuredAt,
            imageUrl: latestAnalysis.imageUrl,
          };

          this.recommendations = (latestRecommend.products || []).map((p: any) => ({
            productId: p.product_id ?? p.productId,
            productName: p.productName,
            brand: p.brand,
            salePrice: p.salePrice,
            averageReviewScore: p.averageReviewScore,
            totalReviewCount: p.totalReviewCount,
            category: p.category,
            imageUrl: p.image_url ?? p.imageUrl,
          }));

          this.saveResult(this.currentResult);
        }
      } catch (e) {
        console.warn("마이페이지 조회 실패", e);
      }
    },

    initFromStorage() {
      this.loadResultFromStorage();
      this.loadFacePreviewFromStorage();
      this.loadFavoritesFromStorage();
    },
  },
});
