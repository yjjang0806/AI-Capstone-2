<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSkinStore } from "@/stores/skinStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import axios from "axios";

const store = useSkinStore();
const user = useUserStore();
const router = useRouter();

const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const countdown = ref(3);
const isCapturing = ref(false);

onMounted(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  if (video.value) video.value.srcObject = stream;
  ctx.value = canvas.value?.getContext("2d") ?? null;
});

async function takePhoto() {
  if (!video.value || !canvas.value) return;

  canvas.value.height = video.value.videoHeight;
  ctx.value?.drawImage(video.value, 0, 0);

  canvas.value.toBlob(async (blob) => {
    if (!blob) return;

    store.setFaceImage(blob, URL.createObjectURL(blob));

    try {
      await store.analyzeSkin(); // 분석 & 추천 API
      router.push("/loading");
    } catch (err) {
      alert("분석 요청 실패. 다시 시도해주세요.");
      console.error(err);
    }
  });
}

function startCountdown() {
  if (isCapturing.value) return;
  isCapturing.value = true;
  countdown.value = 3;

  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(interval);
      takePhoto();
      isCapturing.value = false;
    }
  }, 1000);
}
</script>

<template>
  <div class="camera">
    <video ref="video" autoplay playsinline class="video"></video>
    <canvas ref="canvas" class="canvas"></canvas>

    <div v-if="isCapturing" class="countdown">{{ countdown }}</div>
    <button @click="startCountdown" class="capture-btn">촬영</button>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
.camera {
  width: 100%;
  height: 100vh;
  background: black;
  position: relative;
}
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.countdown {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 72px;
  font-weight: 700;
  color: white;
}
.capture-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 48px;
  border-radius: 30px;
  background: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
