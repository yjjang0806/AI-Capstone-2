<template>
  <div class="home">
    <header class="header">
      <h1 class="logo">VE:GIN</h1>
      <p class="greeting">
        {{ nickname ? nickname + "님," : "" }} 오늘 피부 상태가 궁금하신가요?
      </p>
    </header>

    <section class="card" v-if="result">
      <div class="card-header">
        <p class="card-title">최근 피부 분석 결과</p>
        <p class="date">{{ result.measuredAt }}</p>
      </div>

      <div class="result-main">
        <div class="mbti-badge">{{ result.skinMbtiType }}</div>
        <p class="type">{{ result.skinType }}</p>
        <p class="headline">{{ result.headline }}</p>
        <p class="desc">
          {{ result.skinDescription }}
        </p>
      </div>

      <div class="indices">
        <div class="idx" v-for="item in indicesList" :key="item.key">
          <p class="idx-label">{{ item.label }}</p>
          <div class="idx-bar">
            <div class="fill" :style="{ width: item.percent + '%' }"></div>
          </div>
        </div>
      </div>

      <button class="primary-btn" @click="goResult">자세히 보기</button>
    </section>

    <section class="card" v-else>
      <p class="card-title">아직 분석 결과가 없어요</p>
      <p class="empty-text">
        한 장의 셀카와 몇 가지 질문만으로<br />
        나의 비건 화장품 루틴을 시작해보세요.
      </p>
      <button class="primary-btn" @click="startAnalysis">
        지금 피부 분석 시작하기
      </button>
    </section>

    <section class="card" v-if="recommendations?.length>0">
      <p class="card-title">오늘의 추천 비건 화장품</p>
      <ul class="reco-list">
        <li
          v-for="item in top3"
          :key="item.productId"
          class="reco-item"
          @click="openDetail(item.productId)"
        >
          <img :src="item.imageUrl" class="thumb" />
          <div class="info">
            <p class="brand">{{ item.brand }}</p>
            <p class="name">{{ item.productName }}</p>
            <p class="price">{{ item.salePrice.toLocaleString() }}원</p>
          </div>
        </li>
      </ul>
      <button class="secondary-btn" @click="goRecommendation">
        전체 추천 보러가기
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const skinStore = useSkinStore();
const userStore = useUserStore();

onMounted(() => {
  skinStore.initFromStorage();
  skinStore.fetchLatestFromMyPage().catch(() => {});
});

const result = computed(() => skinStore.currentResult|| null);
const recommendations = computed(() => skinStore.recommendations||[]);
const nickname = computed(() => userStore.user?.nickname || "");

const indicesList = computed(() => {
  if (!result.value) return [];
  const ind = result.value.indices;
  return [
    { key: "oil", label: "유분", percent: Math.min(ind.oil * 20, 100) },
    { key: "dry", label: "건조", percent: Math.min(ind.dry * 20, 100) },
    {
      key: "sensitivity",
      label: "민감",
      percent: Math.min(ind.sensitivity * 20, 100),
    },
    {
      key: "wrinkle",
      label: "주름",
      percent: Math.min(ind.wrinkle * 20, 100),
    },
    {
      key: "pigment",
      label: "색소",
      percent: Math.min(ind.pigment * 20, 100),
    },
  ];
});

const top3 = computed(() => Array.isArray(recommendations.value)?recommendations.value.slice(0, 3):[]);

const startAnalysis = () => router.push("/camera");
const goResult = () => router.push("/result");
const goRecommendation = () => router.push("/recommendation");
const openDetail = (id: string) => router.push(`/product/${id}`);
</script>

<style scoped>
.home {
  width: 393px;
  min-height: 852px;
  margin: 0 auto;
  padding: 32px 20px 24px;
  background: #f7f8f7;
  box-sizing: border-box;
}

.header {
  margin-bottom: 16px;
}

.logo {
  font-size: 24px;
  color: #27481e;
  margin-bottom: 4px;
}

.greeting {
  font-size: 14px;
  color: #7b7b7b;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 18px 18px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #27481e;
}

.date {
  font-size: 12px;
  color: #a1a1a1;
}

.result-main {
  margin-bottom: 14px;
}

.mbti-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #27481e;
  font-size: 11px;
  color: #27481e;
  margin-bottom: 6px;
}

.type {
  font-size: 18px;
  font-weight: 600;
  color: #27481e;
}

.headline {
  margin-top: 6px;
  font-size: 14px;
  color: #333;
}

.desc {
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

.indices {
  margin-top: 10px;
  margin-bottom: 14px;
}

.idx {
  margin-bottom: 6px;
}

.idx-label {
  font-size: 12px;
  color: #777;
  margin-bottom: 2px;
}

.idx-bar {
  height: 6px;
  border-radius: 999px;
  background: #edf0ec;
  overflow: hidden;
}

.idx-bar .fill {
  height: 100%;
  background: #27481e;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  cursor: pointer;
}

.primary-btn {
  background: #27481e;
  color: white;
}

.secondary-btn {
  margin-top: 8px;
  background: #ffffff;
  color: #27481e;
  border: 1px solid #d7ddd6;
}

.empty-text {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin: 12px 0 18px;
}

.reco-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 4px;
}

.reco-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.thumb {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 10px;
}

.info .brand {
  font-size: 11px;
  color: #888;
}

.info .name {
  font-size: 14px;
  color: #333;
  margin-top: 2px;
}

.info .price {
  font-size: 13px;
  color: #27481e;
  margin-top: 4px;
}
</style>
