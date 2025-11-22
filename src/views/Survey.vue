<template>
  <div class="survey">
    <div class="progress-wrapper">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <div class="progress-text">{{ progress }}%</div>

    <div v-if="index > 0" class="prev" @click="prevQuestion">이전 질문으로</div>

    <h2 class="question">{{ current.question }}</h2>

    <div class="options">
      <div
        v-for="(opt, i) in current.options"
        :key="i"
        class="option"
        :class="{ active: selected === opt }"
        @click="selectOption(opt)"
      >
        {{ opt }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";

interface Question {
  question: string;
  options: string[];
}

const router = useRouter();
const store = useSkinStore();

const questions: Question[] = [
  { question: "평소에 얼굴에 유분감이 느껴지는 부위는 어디인가요?",
    options: ["없어요", "T존 일부 (이마 혹은 코)", "T존 전체 (이마와 코)", "얼굴 전체"]
  },
  { question: "세안 직후 얼굴에 홍조나 붉은 기가 보이나요?",
    options: ["전혀 안 보여요", "가끔 있어요", "부분적으로 보여요", "전체적으로 보여요"]
  },
  { question: "외출 후 반나절이 지나면 피부가 번들거리나요?",
    options: ["더 건조해짐", "변함없음", "약간 번들거림", "많이 번들거림"]
  },
  { question: "얼굴에 핏줄이 도드라져 보이나요?",
    options: ["전혀 안 보여요", "가끔 보여요", "부분적으로 보여요", "곳곳에 많이 보여요"]
  },
  { question: "평소 건조함이 느껴지는 부위가 있나요?",
    options: ["없어요", "U존 일부", "U존 전체", "얼굴 전체"]
  },
  { question: "웃거나 찡그리면 주름이 생기나요?",
    options: ["안 생겨요", "표정 지을 때만", "가볍게 있음", "표정 없이도 있음"]
  },
  { question: "주름의 깊이는 어떤가요?",
    options: ["없어요", "잔주름", "깊은 주름", "둘 다 있음"]
  },
  { question: "입 주변 팔자 주름이 생기나요?",
    options: ["없어요", "미소 지을 때만", "진하게 생김", "표정 없이도 생김"]
  },
  { question: "얼굴에 잡티/기미가 보이나요?",
    options: ["전혀 없음", "거의 없음", "약간 있음", "많이 보임"]
  },
  { question: "햇빛에 노출 정도는 어느 정도인가요?",
    options: ["거의 없음", "1시간 이내", "1~2시간 이상", "반나절 이상"]
  }
];

const index = ref(0);
const selected = ref<string | null>(null);
const answers = ref<string[]>([]);

// ⚠️ TS 에러 제거 & 안전하게 보장
const current = computed(() => questions[index.value]!);

const progress = computed(() =>
  Math.round(((index.value + 1) / questions.length) * 100)
);

function selectOption(opt: string) {
  selected.value = opt;
  answers.value[index.value] = opt;

  setTimeout(() => {
    if (index.value < questions.length - 1) {
      index.value++;
      selected.value = null;
    } else {
      store.setSurveyAnswers(answers.value); // 저장
      router.push("/loading"); // 로딩 페이지 이동
    }
  }, 200);
}

function prevQuestion() {
  if (index.value > 0) {
    index.value--;
    selected.value = answers.value[index.value] ?? null;
  }
}
</script>

<style scoped>
.survey {
  padding: 0 24px;
  padding-top: 40px;
}

.progress-wrapper {
  width: 100%;
  height: 6px;
  background: #e8ede8;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 6px;
  background: #244424;
  transition: width 0.3s;
}

.progress-text {
  margin-top: 8px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.prev {
  margin-top: 20px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b6b6b;
  text-align: right;
  cursor: pointer;
}

.question {
  width: 236px;
  margin: 30px auto 32px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px 14px;
}

.option {
  width: 140px;
  height: 140px;
  border: 1.5px solid #244424;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 16px;
  color: #244424;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.option.active {
  background: #1d5113;
  color: white;
  border-color: #1d5113;
  transform: scale(1.03);
}
</style>
