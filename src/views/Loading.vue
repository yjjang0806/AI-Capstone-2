<!-- src/views/Loading.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";
import { useSurveyStore } from "@/stores/surveyStore";
import { submitAnalysisAPI } from "@/api/axios";

const router = useRouter();
const skinStore = useSkinStore();
const surveyStore = useSurveyStore();

const message = ref("피부를 분석하고 있어요...");
const isError = ref(false);

onMounted(async () => {
  if (!skinStore.faceImage) {
    isError.value = true;
    message.value = "얼굴 사진이 없습니다. 다시 촬영해주세요.";
    setTimeout(() => router.replace("/camera"), 1500);
    return;
  }

  try {
    const res = await submitAnalysisAPI(
      skinStore.faceImage,
      surveyStore.answers
    );
    const data = res.data?.data;

    if (!data) {
      throw new Error("서버에서 결과를 받지 못했습니다.");
    }

    // 백엔드 spec: data 안에 최종 구조가 들어있음
    const packed = {
      imageUrl: data.imageUrl,
      skinMbtiType: data.skinMbtiType,
      skinType: data.skinType,
      skinDescription: data.skinDescription,
      headline: data.headline,
      whiteListIngredients: data.whiteListIngredients,
      whiteListRecommendation: data.whiteListRecommendation,
      blackListIngredients: data.blackListIngredients,
      indices: data.indices,
      visionRaw: data.visionRaw,
      recommendations: data.recommendations,
    };

    skinStore.setAnalysisResult(packed as any);
    router.replace("/result");
  } catch (e) {
    console.error(e);
    isError.value = true;
    message.value = "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
});
</script>

<template>
  <div class="page-root">
    <div class="app-page loading-page">
      <div class="loader" />
      <p class="loading-text" :class="{ error: isError }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.page-root {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #e5e5e5;
  border-top-color: #27481e;
  animation: spin 0.8s linear infinite;
  margin-bottom: 18px;
}

.loading-text {
  font-size: 16px;
  color: #27481e;
  text-align: center;
}

.loading-text.error {
  color: #d03a3a;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
