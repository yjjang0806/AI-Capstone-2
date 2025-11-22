<template>
  <div class="home-container">
    <div class="content">
      <div class="top-row">
        <div class="top-title">당신의 피부 결과</div>
        <button class="history-btn" @click="loadHistory" :disabled="loadingResult">
          {{ loadingResult ? "불러오는 중..." : "지난 측정 결과 불러오기" }}
        </button>
      </div>

      <div class="main-card">
        <div class="left">
          <img v-if="faceImage" :src="faceImage" class="img-box" />
          <div v-else class="img-box empty"></div>
        </div>

        <div class="right">
          <div class="skin-type">
            {{ result?.skinType || "피부 타입 미측정" }}🌿
          </div>
          <div class="type-desc">
            {{ result?.skinDescription || "피부 측정을 완료하면 결과가 표시됩니다." }}
          </div>

          <div class="label">측정 날짜</div>
          <div class="date">{{ result?.measuredAt || "-" }}</div>

          <button class="measure-btn" @click="goMeasure">다시 측정하기</button>
        </div>
      </div>

      <div class="section-title">내가 담았던 추천 화장품</div>

      <div v-if="loadingRecommendations" class="loading-text">
        추천 제품을 불러오는 중입니다...
      </div>

      <div v-else class="product-list">
        <template v-if="recommendations.length">
          <div
            class="product-card"
            v-for="item in recommendations"
            :key="item.productId"
            @click="openDetail(item.productId)"
          >
            <button
              class="fav-btn"
              :class="{ active: isFavorite(item.productId) }"
              @click.stop="toggleFav(item.productId)"
            >
              ♥
            </button>

            <img :src="item.imageUrl" class="product-img" />

            <div class="product-name">{{ item.productName }}</div>
            <div class="product-sub">{{ item.brand }}</div>
            <div class="product-price">
              {{ item.salePrice.toLocaleString() }}원
            </div>
          </div>
        </template>

        <div v-else class="empty-text">아직 담아둔 추천 화장품이 없어요.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";

const router = useRouter();
const store = useSkinStore();

const result = computed(() => store.currentResult);
const faceImage = computed(
  () => store.currentResult?.imageUrl || store.facePreviewUrl,
);
const recommendations = computed(() => store.recommendations);
const loadingResult = computed(() => store.loadingAnalysis);
const loadingRecommendations = computed(() => store.loadingRecommendations);

onMounted(async () => {
  store.initFromStorage();
  // 필요할 때만 MyPage에서 최근 결과 가져오기
  if (!store.currentResult) {
    await store.fetchLatestFromMyPage();
  }
});

function loadHistory() {
  store.loadResultFromStorage();
}

function goMeasure() {
  router.push("/camera");
}

function openDetail(id: string) {
  router.push(`/product/${id}`);
}

function toggleFav(id: string) {
  store.toggleFavorite(id);
}

function isFavorite(id: string) {
  return store.isFavorite(id);
}
</script>

<style scoped>
.home-container {
  width: 100%;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
}
.content {
  width: 100%;
  max-width: 393px;
  background: white;
  padding: 50px 24px 40px;
  box-sizing: border-box;
  min-height: 100vh;
}
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.top-title {
  font-size: 18px;
  color: #1d1d1d;
  font-family: "Kyobo";
}
.history-btn {
  border-radius: 999px;
  border: 1px solid #244424;
  background: #ffffff;
  color: #244424;
  font-size: 11px;
  padding: 6px 10px;
  font-family: "Kyobo";
}
.history-btn:disabled {
  opacity: 0.6;
}
.main-card {
  display: flex;
  width: 100%;
  gap: 14px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}
.img-box {
  width: 110px;
  height: 140px;
  border-radius: 8px;
  object-fit: cover;
}
.img-box.empty {
  background: #dadada;
}
.right {
  flex: 1;
}
.skin-type {
  font-size: 22px;
  font-weight: 700;
  color: #244424;
  font-family: "Kyobo";
}
.type-desc {
  font-size: 13px;
  color: #4b4b4b;
  margin-bottom: 12px;
  font-family: "Kyobo";
}
.label {
  font-size: 12px;
  font-family: "Kyobo";
  color: #666;
  margin-top: 10px;
}
.date {
  font-size: 14px;
  font-family: "Kyobo";
}
.measure-btn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #244424;
  color: white;
  margin-top: 14px;
  font-size: 14px;
  font-family: "Kyobo";
}
.section-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1d;
  font-family: "Kyobo";
}
.loading-text,
.empty-text {
  font-size: 13px;
  color: #777;
  margin-top: 6px;
}
.product-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.product-list::-webkit-scrollbar {
  display: none;
}
.product-card {
  flex: 0 0 70%;
  max-width: 240px;
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
  scroll-snap-align: start;
}
.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
  color: #999;
}
.fav-btn.active {
  color: #e64b4b;
}
.product-img {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
}
.product-name {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #333;
  font-family: "Kyobo";
}
.product-sub {
  font-size: 13px;
  color: #666;
}
.product-price {
  margin-top: 4px;
  font-size: 14px;
  font-family: "Kyobo";
  color: #1d1d1d;
}
</style>
