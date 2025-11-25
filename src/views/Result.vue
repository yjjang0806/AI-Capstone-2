<!-- src/views/Result.vue -->
<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";

const router = useRouter();
const skinStore = useSkinStore();
const result = skinStore.analysisResult;

onMounted(() => {
  if (!skinStore.analysisResult) {
    // 새로고침 등으로 값 날아간 경우
    router.replace("/camera");
  }
});
</script>

<template>
  <div class="page-root" v-if="result">
    <div class="app-page result-page">
      <!-- 상단 이미지 -->
      <div class="image-wrap">
        <img :src="result.imageUrl" alt="피부 이미지" />
      </div>

      <!-- 요약 -->
      <h1 class="headline">{{ result.headline }}</h1>
      <p class="mbti">
        피부 MBTI :
        <span>{{ result.skinMbtiType }}</span>
      </p>
      <p class="type">피부 타입 : {{ result.skinType }}</p>
      <p class="desc">
        {{ result.skinDescription }}
      </p>

      <!-- 성분 가이드 -->
      <section class="section">
        <h2>추천 성분</h2>
        <p class="guide-text">{{ result.whiteListRecommendation }}</p>
        <ul class="tag-list">
          <li v-for="item in result.whiteListIngredients" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="section">
        <h2>피해야 할 성분</h2>
        <ul class="tag-list bad">
          <li v-for="item in result.blackListIngredients" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <!-- 다시 촬영 -->
      <button class="retry-btn" @click="router.replace('/camera')">
        다시 촬영하기
      </button>
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

.result-page {
  padding-top: 24px;
  padding-bottom: 32px;
}

.image-wrap {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
}

.image-wrap img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.headline {
  font-size: 20px;
  color: #27481e;
  margin-bottom: 6px;
}

.mbti {
  font-size: 15px;
  margin-bottom: 4px;
}

.mbti span {
  font-weight: 700;
}

.type {
  font-size: 15px;
  margin-bottom: 8px;
}

.desc {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
}

/* 섹션 */
.section {
  margin-bottom: 18px;
}

.section h2 {
  font-size: 16px;
  margin-bottom: 6px;
  color: #27481e;
}

.guide-text {
  font-size: 13px;
  margin-bottom: 8px;
}

/* 태그 리스트 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-list li {
  list-style: none;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eaf3ea;
  font-size: 12px;
}

.tag-list.bad li {
  background: #ffe8e8;
  color: #b71818;
}

/* 다시 촬영 */
.retry-btn {
  margin-top: 20px;
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: none;
  background: #27481e;
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
}
</style>
