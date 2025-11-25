<!-- src/views/Camera.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";

const router = useRouter();
const skinStore = useSkinStore();

const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const insideGuide = ref(false);
const countdown = ref(0);

let detector: any = null;
let animationId: number | null = null;
let stream: MediaStream | null = null;
let countdownTimer: any = null;

const GUIDE_W = 240;
const GUIDE_H = 310;

const loadDetector = async () => {
  const w = window as any;
  if (w.FaceDetector) {
    detector = new w.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
  } else {
    detector = null;
  }
};

const checkFace = async () => {
  if (!video.value) return requestAnimationFrame(checkFace);

  if (!detector) {
    insideGuide.value = true;
    return requestAnimationFrame(checkFace);
  }

  try {
    const faces = await detector.detect(video.value);
    if (!faces || faces.length === 0) {
      insideGuide.value = false;
    } else {
      const box = faces[0].boundingBox;
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      const vw = video.value.videoWidth || 1;
      const vh = video.value.videoHeight || 1;

      insideGuide.value =
        Math.abs(cx - vw / 2) < GUIDE_W * 0.55 &&
        Math.abs(cy - vh / 2) < GUIDE_H * 0.60;
    }
  } catch {
    insideGuide.value = false;
  }

  animationId = requestAnimationFrame(checkFace);
};

const canShoot = computed(() => !detector || insideGuide.value);

const startCountdown = () => {
  if (countdownTimer) return;
  countdown.value = 3;

  countdownTimer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      capture();
    }
  }, 1000);
};

const handleCaptureBtn = () => {
  if (!canShoot.value) return;
  startCountdown();
};

const capture = () => {
  if (!video.value || !canvas.value) return;

  const v = video.value;
  const c = canvas.value;
  const ctx = c.getContext("2d")!;
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  ctx.drawImage(v, 0, 0, c.width, c.height);

  c.toBlob((blob) => {
    if (!blob) return alert("이미지 저장 실패");
    const file = new File([blob], "face.png");
    skinStore.setFaceImage(file);
    router.push("/survey");
  }, "image/png");
};

onMounted(async () => {
  await loadDetector();

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });

  if (video.value) {
    video.value.srcObject = stream;
    video.value.play();
    video.value.addEventListener("loadeddata", () => {
      animationId = requestAnimationFrame(checkFace);
    });
  }
});

onBeforeUnmount(() => {
  if (animationId !== null) cancelAnimationFrame(animationId);
  if (stream) stream.getTracks().forEach((t) => t.stop());
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<template>
  <div class="camera-root">
    <div class="camera">
      <video ref="video" autoplay playsinline class="video" />
      <canvas ref="canvas" class="canvas"></canvas>

      <p class="guide-text">얼굴을 가이드 안에 맞춰주세요</p>

      <div class="oval" :class="{ ok: insideGuide }"></div>

      <div v-if="countdown > 0" class="countdown">{{ countdown }}</div>

      <button class="shoot" :disabled="!canShoot" @click="handleCaptureBtn">
        촬영하기
      </button>
    </div>
  </div>
</template>

<style scoped>
.camera-root {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera {
  width: 393px;
  height: 852px;
  background: #000;
  position: relative;
  overflow: hidden;
}

.video,
.canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

.guide-text {
  position: absolute;
  top: 26px;
  width: 100%;
  text-align: center;
  color: #ffffff;
  font-size: 14px;
}

.oval {
  position: absolute;
  width: 240px;
  height: 310px;
  border-radius: 46% 46% 50% 50%;
  border: 3px solid rgba(255, 0, 0, 0.7);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: border-color 0.18s;
}

.oval.ok {
  border-color: #33ff65;
}

.countdown {
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 120px;
  font-weight: 800;
  text-shadow: 0 0 18px rgba(0, 0, 0, 0.6);
}

.shoot {
  position: absolute;
  bottom: 42px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 52px;
  border-radius: 14px;
  border: none;
  background: #27481e;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
}

.shoot:disabled {
  background: #5e6c5a;
  opacity: 0.8;
  cursor: default;
}
</style>
