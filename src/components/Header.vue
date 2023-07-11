<template>
  <header>
    <div v-if="auth.loggedIn">
      <h1>Hello, {{ auth.username }}!</h1>
      <button @pointerup="logout">Logout</button>
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
  font-size: small;
  height: max-content;
  text-wrap: balance;
}
</style>
