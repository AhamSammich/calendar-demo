<script setup>
import Header from './components/Header.vue'
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
</script>

<template>
  <Header />
  <router-view></router-view>
</template>

<style scoped>
</style>
