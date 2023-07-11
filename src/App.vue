<script setup>
import Header from "./components/Header.vue";
</script>

<template>
  <Header />
  <router-view></router-view>
</template>

<style>
:root:root {
  --van-cell-group-inset-radius: 0.25rem;
  --van-cell-group-inset-padding: 1rem;
  --van-cell-vertical-padding: 1rem;
  --van-cell-horizontal-padding: 1.5rem;
  --van-cell-font-size: large;
  --van-cell-border-color: slategray;
  --van-cell-background: transparent;
}

form {
  position: absolute;
  inset: 0;
  width: max-content;
  height: max-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

button {
  margin: 0 2rem;
  font-weight: bold;
  font-size: large;
  border-radius: 0.25rem;
}

.visually-hidden {
  margin: 0;
  padding: 0;
  height: 0;
  opacity: 0;
}
</style>
