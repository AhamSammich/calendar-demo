<script setup>
import Header from "./components/Header.vue";
</script>

<template>
  <router-view></router-view>
</template>

<style>
:root:root {
  --van-cell-group-inset-radius: 0.25rem;
  --van-cell-radius: 0.25rem;
  --van-cell-group-inset-padding: 1rem;
  --van-cell-vertical-padding: 1rem;
  --van-cell-horizontal-padding: 1.5rem;
  --van-cell-font-size: large;
  --van-cell-group-background: transparent;
}

form {
  position: absolute;
  inset: 0;
  width: max-content;
  max-width: 40ch;
  height: max-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

button {
  width: calc(100% - 2rem);
  align-self: center;
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
