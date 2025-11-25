import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSkinStore = defineStore("skin", () => {
  const faceImage = ref<File | null>(null);
  const analysisResult = ref<any | null>(null);

  const setFaceImage = (img: File | null) => (faceImage.value = img);
  const setAnalysisResult = (res: any) => {
    analysisResult.value = res;
    localStorage.setItem("skinAnalysisResult", JSON.stringify(res));
  };

  const initFromStorage = () => {
    const stored = localStorage.getItem("skinAnalysisResult");
    if (stored) analysisResult.value = JSON.parse(stored);
  };

  const currentResult = computed(() => analysisResult.value);
  const recommendations = computed(
    () => analysisResult.value?.recommendations ?? []
  );

  return {
    faceImage,
    analysisResult,
    setFaceImage,
    setAnalysisResult,
    initFromStorage,
    currentResult,
    recommendations,
  };
});
