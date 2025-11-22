<template>
  <div class="detail-container">
    <img :src="product.image" class="main-img" />

    <div class="info">
      <h2 class="name">{{ product.name }}</h2>
      <p class="price">{{ formatPrice(product.price) }}</p>

      <div class="section">
        <h3>제품 특징</h3>
        <p class="desc">{{ product.description }}</p>
      </div>

      <div class="section">
        <h3>추천 이유</h3>
        <p class="desc">{{ product.reason }}</p>
      </div>
    </div>

    <button class="back-btn" @click="goBack">뒤로가기</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// mock
const product = ref({
  id: route.params.id,
  name: "Nare Night cream",
  price: 29000,
  image: "/img/p1.png",
  description: "피부 보습에 좋은 크림입니다.",
  reason: "건성 피부에 필요한 수분막 형성",
});

function formatPrice(p: number) {
  return p.toLocaleString() + "원";
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.detail-container {
  padding: 24px;
  max-width: 393px;
  margin: 0 auto;
}

.main-img {
  width: 100%;
  border-radius: 12px;
}

.info {
  margin-top: 24px;
}

.name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.price {
  font-size: 18px;
  color: #244424;
}

.section {
  margin-top: 24px;
}

.section h3 {
  font-size: 17px;
  margin-bottom: 6px;
}

.desc {
  color: #555;
  font-size: 15px;
}

.back-btn {
  margin-top: 40px;
  width: 100%;
  height: 52px;
  background: #244424;
  color: white;
  font-family: "Kyobo";
  border: none;
  border-radius: 12px;
}
</style>
