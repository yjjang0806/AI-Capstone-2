<template>
  <div class="loading">
    <div class="spinner"></div>
    <p>피부 타입 분석 준비 중...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";

const router = useRouter();
const store = useSkinStore();

onMounted(() => {
  console.log("📌 저장된 설문 결과:", store.surveyAnswers);

  // UX: 잠시 대기 후 카메라로 이동
  setTimeout(() => {
    router.push("/camera");
  }, 2000);
});
</script>

<style scoped>
.loading {
  width: 100%;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Kyobo";
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #e2e2e2;
  border-top: 6px solid #1d5113;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 18px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  font-size: 18px;
  color: #1d5113;
}
</style>

