<template>
  <div class="landing">
    <h1>VE:GIN</h1>
    <p>나의 비건 화장품 생활의 시작</p>
    <button @click="$router.push('/login')">로그인</button>
    <button @click="$router.push('/join')">회원가입</button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.landing {
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Kyobo";
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  background: #244424;
  color: #fff;
}
</style>
