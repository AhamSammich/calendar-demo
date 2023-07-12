<template>
  <div class="root">
    <van-form @submit="handleSubmit">
      <van-cell-group inset class="field-group">
        <van-field
          v-model="credentials.username"
          type="text"
          label="Username"
          label-align="top"
          placeholder="Enter username"
          autocomplete="username"
          :rules="[
            {
              required: true,
              message: 'Username is required',
            },
          ]"
        />
        <van-field
          v-model="credentials.password"
          type="password"
          label="Password"
          label-align="top"
          placeholder="Enter Password"
          autocomplete="current-password"
          :rules="[
            {
              required: true,
            },
          ]"
        />
      </van-cell-group>
      <van-button type="primary" native-type="submit"> Login </van-button>
      <router-link to="/signup">I don't have an account &rarr;</router-link>
    </van-form>
    <Transition name="van-slide-up">
      <div v-if="errorOnSubmit" class="notification error">{{ errorOnSubmit }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { showLoadingToast } from "vant";

const router = useRouter();
const auth = useAuthStore();

const credentials = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});

const errorOnSubmit = ref(false);

const goToHome = () => {
  showLoadingToast({
    message: "Logging in...",
    duration: 500,
  });
  router.push("/");
};

const handleSubmit = async () => {
  const { error } = await auth.loginUser(credentials);
  if (error) {
    errorOnSubmit.value = error;
  } else {
    errorOnSubmit.value = false;
    goToHome();
  }
};

onBeforeMount(() => {
  if (auth.loggedIn) {
    goToHome();
  }
});
</script>

<style scoped>
.notification {
  width: max-content;
  height: max-content;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 2rem;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 0.5rem;
}

.success {
  border: 1px solid springgreen;
  box-shadow: 0 0 0.2rem palegreen;
}

.error {
  border: 1px solid red;
}
</style>
