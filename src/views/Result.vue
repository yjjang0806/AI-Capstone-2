<template>
  <div class="result" v-if="result">
    <img class="photo" :src="result.imageUrl" />

    <h2 class="headline">{{ result.headline }}</h2>
    <p class="description">{{ result.skinDescription }}</p>

    <section>
      <h3>피부 지표</h3>
      <ul>
        <li v-for="(v, k) in result.indices" :key="k">
          {{ convertLabel(k) }}: {{ v }}
        </li>
      </ul>
    </section>

    <button class="recommend-btn" @click="goToRecommendation">
      추천 제품 보기
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";

const store = useSkinStore();
const router = useRouter();

const result = computed(() => store.currentResult);

function convertLabel(k: string) {
  return (
    {
      oil: "유분",
      dry: "건조",
      sensitivity: "민감",
      wrinkle: "주름",
      pigment: "색소",
    }[k] ?? k
  );
}

function goToRecommendation() {
  router.push("/recommendation");
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.result {
  padding: 20px;
}
.photo {
  width: 100%;
  border-radius: 12px;
}
.headline {
  margin-top: 18px;
  font-size: 20px;
  font-weight: 700;
}
.description {
  margin-top: 8px;
  font-size: 15px;
  line-height: 22px;
}
.recommend-btn {
  margin-top: 30px;
  width: 100%;
  height: 54px;
  border: none;
  background: #244424;
  color: white;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
}
</style>
