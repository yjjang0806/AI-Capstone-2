<template>
  <div class="join">
    <img class="back" :src="back" @click="goBack" />

    <div class="title">Email로 가입하기</div>

    <div class="box">
      <input type="email" v-model="email" placeholder="이메일을 입력하세요" />
    </div>

    <div class="box">
      <input v-model="nickname" placeholder="닉네임을 입력하세요" />
    </div>

    <div class="box">
      <input v-model="birthDate" placeholder="생년월일 (YYYY-MM-DD)" />
    </div>

    <div class="box">
      <select v-model="gender">
        <option value="">성별 선택</option>
        <option value="FEMALE">여성</option>
        <option value="MALE">남성</option>
      </select>
    </div>

    <div class="box password-box">
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        placeholder="비밀번호"
      />
      <img
        class="eye"
        :src="showPassword ? eyeClose : eyeOpen"
        @click="togglePassword"
      />
    </div>

    <button class="join-btn" @click="handleSignup" :disabled="loading">
      {{ loading ? "가입 중..." : "가입하기" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import back from "@/assets/back.png";
import eyeOpen from "@/assets/eye-open.svg";
import eyeClose from "@/assets/eye-close.svg";

const router = useRouter();

const showPassword = ref(false);
const email = ref("");
const password = ref("");
const nickname = ref("");
const gender = ref("");
const birthDate = ref("");
const loading = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSignup = async () => {
  if (!email.value || !password.value || !gender.value || !birthDate.value) {
    alert("필수 정보를 모두 입력해주세요.");
    return;
  }

  loading.value = true;

  try {
    await axios.post(
      "/api/auth/signup",
      {
        email: email.value,
        password: password.value,
        nickname: nickname.value || "user",
        gender: gender.value,
        birthDate: birthDate.value,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    alert("회원가입이 완료되었습니다. 로그인 해주세요.");
    router.push("/login");
  } catch (e: any) {
    console.error("Signup error:", e);

    const msg =
      e.response?.data?.message ??
      "회원가입에 실패했습니다. 다시 시도해주세요.";
    alert(msg);
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.push("/");
</script>

<style scoped>
.join {
  width: 393px;
  height: 852px;
  background: #ffffff;
  margin: 0 auto;
  font-family: "Kyobo";
  position: relative;
}
.back {
  width: 38px;
  height: 38px;
  position: absolute;
  top: 40px;
  left: 20px;
  cursor: pointer;
}
.title {
  text-align: center;
  font-size: 22px;
  margin-top: 110px;
  margin-bottom: 35px;
  color: #1d5113;
  font-family: "Kyobo";
}
.box {
  width: 347px;
  height: 59px;
  background: #f3f4f6;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  margin: 0 auto 18px auto;
  display: flex;
  align-items: center;
  padding: 0 18px;
  box-sizing: border-box;
}
.box input,
.box select {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  color: #1d5113;
  font-family: "Kyobo";
}
.password-box {
  position: relative;
}
.eye {
  width: 26px;
  height: 26px;
  position: absolute;
  right: 18px;
  cursor: pointer;
}
.join-btn {
  width: 347px;
  height: 59px;
  margin: 0 auto;
  border: none;
  background: #27481e;
  color: white;
  border-radius: 10px;
  font-size: 18px;
  font-family: "Kyobo";
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.join-btn:disabled {
  opacity: 0.6;
}
</style>
