<!-- src/views/Survey.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "@/stores/surveyStore";

const router = useRouter();
const surveyStore = useSurveyStore();

const QUESTIONS = [
  {
    text: "평소에 얼굴에 유분감이 느껴지는 부위는 어디인가요?",
    options: ["없어요", "T존 일부 (이마 혹은 코)", "T존 전체 (이마와 코)", "얼굴 전체"],
  },
  {
    text: "세안 직후 얼굴에 홍조나 붉은 기가 보이나요?",
    options: [
      "전혀 없어요",
      "자극은 없지만 가끔 보여요",
      "부분적으로 붉게 보여요",
      "전체적으로 붉게 보여요",
    ],
  },
  {
    text: "세안 후 1시간 뒤 피부 상태를 가장 잘 표현한 것은?",
    options: ["땅김이 심해요", "약간 건조해요", "적당해요", "번들거려요"],
  },
  {
    text: "하루 중 피부 당김을 느끼는 시간이 있나요?",
    options: ["거의 항상", "오후만 되면", "가끔", "없어요"],
  },
  {
    text: "트러블(여드름·뾰루지)은 얼마나 자주 생기나요?",
    options: ["자주", "가끔", "거의 없음", "전혀 없음"],
  },
  {
    text: "모공이 가장 신경 쓰이는 부위는?",
    options: ["코 주변", "볼", "전체", "신경 쓰이지 않아요"],
  },
  {
    text: "색소침착(기미·잡티·흉터) 정도는 어떤가요?",
    options: ["많아요", "조금 있어요", "미세하게 있어요", "거의 없어요"],
  },
  {
    text: "피부가 외부 자극(햇빛·마스크·건조함)에 민감하게 반응하나요?",
    options: ["심하게", "가끔", "거의 없음", "전혀 없음"],
  },
  {
    text: "세럼/크림을 사용했을 때 피부 반응은 어떤가요?",
    options: [
      "따가움/홍조 생김",
      "흡수 안 되고 겉돌아요",
      "보통이에요",
      "흡수 잘 되고 편안해요",
    ],
  },
  {
    text: "얼굴에 주름이 가장 신경 쓰이는 부위는?",
    options: ["눈가", "입가/팔자", "이마", "신경 쓰이지 않아요"],
  },
];

const total = QUESTIONS.length;
const currentIndex = ref(0);

const currentQuestion = computed(() => QUESTIONS[currentIndex.value]);
const selectedAnswer = computed(
  () => surveyStore.answers[currentIndex.value] || ""
);
const progressPercent = computed(
  () => ((currentIndex.value + 1) / total) * 100
);
const canGoNext = computed(() => !!selectedAnswer.value);

const selectOption = (option: string) => {
  surveyStore.setAnswer(currentIndex.value, option);
};

const goNext = () => {
  if (!canGoNext.value) {
    alert("답변을 선택해주세요.");
    return;
  }
  if (currentIndex.value < total - 1) {
    currentIndex.value += 1;
  } else {
    router.push("/loading");
  }
};

const goPrev = () => {
  if (currentIndex.value > 0) currentIndex.value -= 1;
};

onMounted(() => {
  surveyStore.reset();
});
</script>

<template>
  <div class="page-root">
    <div class="app-page survey-page">
      <!-- 상단 진행바 -->
      <div class="progress-wrap">
        <div class="progress-top">
          <span class="progress-text">
            {{ currentIndex + 1 }} / {{ total }}
          </span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{ width: progressPercent + '%' }"
          />
        </div>
      </div>

      <!-- 질문 -->
      <h1 class="question-text">
        {{ currentQuestion.text }}
      </h1>

      <!-- 선택지 -->
      <div class="options-grid">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-card"
          :class="{ active: selectedAnswer === option }"
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>

      <!-- 네비 버튼 -->
      <div class="nav-buttons">
        <button
          class="nav-btn prev"
          :disabled="currentIndex === 0"
          @click="goPrev"
        >
          ◀ 이전
        </button>
        <button
          class="nav-btn next"
          :disabled="!canGoNext"
          @click="goNext"
        >
          {{ currentIndex === total - 1 ? "완료" : "계속하기" }}
        </button>
      </div>
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

.survey-page {
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  padding-bottom: 32px;
}

/* 진행바 */
.progress-wrap {
  margin-bottom: 16px;
}

.progress-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.progress-text {
  font-size: 12px;
  color: #27481e;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: #27481e;
  border-radius: 999px;
}

/* 질문 */
.question-text {
  font-size: 18px;
  line-height: 1.5;
  color: #27481e;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 24px;
}

/* 옵션 그리드 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.option-card {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  border: 1px solid #27481e;
  background: #ffffff;
  font-size: 14px;
  color: #27481e;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.option-card.active {
  background: #27481e;
  color: #ffffff;
}

/* 네비게이션 버튼 */
.nav-buttons {
  margin-top: auto;
  display: flex;
  gap: 10px;
}

.nav-btn {
  flex: 1;
  height: 52px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.nav-btn.prev {
  background: #f3f4f6;
  color: #999999;
}

.nav-btn.prev:disabled {
  opacity: 0.6;
  cursor: default;
}

.nav-btn.next {
  background: #27481e;
  color: #ffffff;
}

.nav-btn.next:disabled {
  background: #cfd2d5;
  color: #ffffff;
  cursor: default;
}
</style>
