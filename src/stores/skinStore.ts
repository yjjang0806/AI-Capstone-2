// src/stores/skinStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export interface SkinIndices {
  oil: number;
  dry: number;
  sensitivity: number;
  wrinkle: number;
  pigment: number;
}

export interface VisionScore {
  score: number;
  reason: string;
}

export interface VisionRaw {
  acne: VisionScore;
  redness: VisionScore;
  melasma_darkspots: VisionScore;
}

export interface RecommendationItem {
  productId?: string;
  productName: string;
  brand: string;
  salePrice: number;
  averageReviewScore: number;
  totalReviewCount: number;
  category: string;
  imageUrl?: string;
}

export interface SkinAnalysisResult {
  imageUrl: string;

  skinMbtiType: string;
  skinType: string;
  skinDescription: string;
  headline: string;

  whiteListIngredients: string[];
  whiteListRecommendation: string;
  blackListIngredients: string[];

  indices: SkinIndices;
  visionRaw: VisionRaw;

  recommendations: RecommendationItem[];
}

export const useSkinStore = defineStore("skin", () => {
  const faceImage = ref<File | null>(null);
  const analysisResult = ref<SkinAnalysisResult | null>(null);

  const setFaceImage = (file: File | null) => {
    faceImage.value = file;
  };

  const setAnalysisResult = (data: SkinAnalysisResult | null) => {
    analysisResult.value = data;
  };

  return {
    faceImage,
    analysisResult,
    setFaceImage,
    setAnalysisResult,
  };
});
