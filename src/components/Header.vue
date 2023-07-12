<template>
  <header>
    <div v-if="auth.loggedIn" class="user-header">
      <h1>Hello, {{ auth.username }}!</h1>
      <van-button type="primary" plain @click="logout">Logout</van-button>
    </div>
    <h1 v-else>Welcome to the Demo Client!</h1>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.logoutUser();
  router.push("/");
};
</script>

<style scoped>
header {
  height: max-content;
  text-wrap: balance;
}

.user-header {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
}

button {
  width: max-content;
  height: max-content;
  padding: 1rem;
}
</style>
