<template>
  <div class="login">
    <img class="back" :src="back" @click="goBack" />

    <h2>로그인</h2>

    <form @submit.prevent="handleLogin" class="form-area">
      <input
        type="email"
        placeholder="이메일 입력"
        v-model="email"
        required
        class="box"
      />
      <input
        type="password"
        placeholder="비밀번호 입력"
        v-model="password"
        required
        class="box"
      />

      <button type="submit" class="box login-btn" :disabled="loading">
        {{ loading ? "로그인 중..." : "로그인" }}
      </button>
    </form>

    <p class="sub">
      계정이 없으신가요?
      <a @click="goJoin">회원가입</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import back from "@/assets/back.png";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  loading.value = true;
  try {
    const res = await axios.post("/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data.data.accessToken;
    userStore.saveToken(token);

    alert("로그인 완료!");
    router.push("/home");
  } catch (e) {
    console.error(e);
    alert("로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.");
  } finally {
    loading.value = false;
  }
};

const goJoin = () => router.push("/join");
const goBack = () => router.push("/");
</script>

<style scoped>
.login {
  width: 393px;
  height: 852px;
  margin: 0 auto;
  background: #ffffff;
  font-family: "Kyobo";
  display: flex;
  flex-direction: column;
  align-items: center;
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
h2 {
  margin-top: 110px;
  margin-bottom: 30px;
  font-size: 22px;
  text-align: center;
  color: #1d5113;
  font-family: "Kyobo";
}
.form-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.box {
  width: 347px;
  height: 59px;
  background: #f3f4f6;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  padding: 0 18px;
  box-sizing: border-box;
  margin-bottom: 18px;
  font-size: 16px;
  font-family: "Kyobo";
  color: #1d5113;
}
.login-btn {
  background: #1d5113;
  color: white;
  border: none;
  font-size: 18px;
  justify-content: center;
  cursor: pointer;
}
.login-btn:disabled {
  opacity: 0.7;
}
.sub {
  margin-top: 10px;
  font-size: 14px;
  font-family: "Kyobo";
}
.sub a {
  color: #1d5113;
  cursor: pointer;
  text-decoration: underline;
}
</style>
