<template>
  <div class="rec-container">
    <header class="header" v-if="result">
      <div class="header-title">내 피부 타입 레포트</div>
      <div class="skin-type">{{ result.skinType }}🍃</div>
      <p class="skin-desc">
        {{ result.skinDescription || result.whiteListRecommendation }}
      </p>
    </header>

    <!-- 스킨/토너 -->
    <section class="section-top">
      <div class="section-label">스킨 · 토너 추천</div>
      <div class="section-sub">세안 후 첫 단계에 사용하면 좋은 추천템이에요.</div>
    </section>
    <section class="cards-wrapper">
      <div class="card-row">
        <ProductCard
          v-for="item in skinToner"
          :key="item.productId"
          :item="item"
          @open="openDetail"
        />
      </div>
      <div v-if="!skinToner.length" class="empty-text">
        아직 추천된 스킨/토너가 없어요.
      </div>
    </section>

    <!-- 앰플/세럼 -->
    <section class="section-top">
      <div class="section-label">앰플 · 세럼 추천</div>
      <div class="section-sub">피부 타입에 맞춘 집중 케어 제품을 담았어요.</div>
    </section>
    <section class="cards-wrapper">
      <div class="card-row">
        <ProductCard
          v-for="item in ampoule"
          :key="item.productId"
          :item="item"
          @open="openDetail"
        />
      </div>
      <div v-if="!ampoule.length" class="empty-text">
        아직 추천된 앰플/세럼이 없어요.
      </div>
    </section>

    <!-- 로션/크림 -->
    <section class="section-top">
      <div class="section-label">로션 · 크림 추천</div>
      <div class="section-sub">보습 유지력과 장벽 보호에 도움이 돼요.</div>
    </section>
    <section class="cards-wrapper">
      <div class="card-row">
        <ProductCard
          v-for="item in lotionCream"
          :key="item.productId"
          :item="item"
          @open="openDetail"
        />
      </div>
      <div v-if="!lotionCream.length" class="empty-text">
        아직 추천된 로션/크림이 없어요.
      </div>
    </section>

    <footer class="button-area">
      <button class="green-btn" @click="goFilter">더 추천 받기</button>
      <button class="gray-btn" @click="goHome">내 화장품 모아보기</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";
import ProductCard from "@/components/ProductCard.vue";

const router = useRouter();
const store = useSkinStore();

onMounted(() => {
  if (!store.currentResult) {
    store.loadResultFromStorage();
  }
});

const result = computed(() => store.currentResult);
const skinToner = computed(() => store.skinToner);
const ampoule = computed(() => store.ampoule);
const lotionCream = computed(() => store.lotionCream);

function openDetail(id: string) {
  router.push(`/product/${id}`);
}
function goFilter() {
  router.push("/filter");
}
function goHome() {
  router.push("/home");
}
</script>

<style scoped>
.rec-container {
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 32px 20px 90px;
  background: #f5f5f5;
  box-sizing: border-box;
}
.header {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 18px 18px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}
.header-title {
  font-size: 14px;
  color: #888;
  margin-bottom: 6px;
  font-family: "Kyobo";
}
.skin-type {
  font-size: 22px;
  font-weight: 800;
  color: #244424;
  margin-bottom: 6px;
  font-family: "Kyobo";
}
.skin-desc {
  font-size: 13px;
  color: #3a5c2f;
  line-height: 20px;
  font-family: "Kyobo";
}
.section-top {
  margin-top: 6px;
  margin-bottom: 8px;
  padding: 0 2px;
}
.section-label {
  font-size: 16px;
  font-weight: 700;
  color: #244424;
  margin-bottom: 4px;
  font-family: "Kyobo";
}
.section-sub {
  font-size: 12px;
  color: #777;
  line-height: 18px;
}
.cards-wrapper {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 0 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.03);
  margin-bottom: 16px;
}
.card-row {
  display: flex;
  gap: 16px;
  padding: 4px 18px 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.card-row::-webkit-scrollbar {
  display: none;
}
.empty-text {
  padding: 14px;
  font-size: 13px;
  text-align: center;
  color: #777;
}
.button-area {
  margin-top: 10px;
}
.green-btn,
.gray-btn {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-family: "Kyobo";
}
.green-btn {
  background: #244424;
  color: #ffffff;
  margin-bottom: 12px;
}
.gray-btn {
  background: #4b4b4b;
  color: #ffffff;
}
</style>
