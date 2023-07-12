<template>
  <div class="root">
    <div v-if="signupComplete" class="notification success">
      <h2>Hello {{ credentials.username }}!</h2>
      <p>Thank you for registering!</p>
    </div>
    <van-form v-else @submit="handleSubmit">
      <van-cell-group inset class="field-group">
        <van-field
          v-model="credentials.username"
          type="text"
          label="Username"
          :right-icon="usernameAvailable ? 'checked' : 'warning-o'"
          :style="`--van-field-right-icon-color: ${
            usernameIsValid ? (usernameAvailable ? 'green' : 'red') : 'transparent'
          }`"
          placeholder="Enter username"
          autocomplete="username"
          :maxlength="15"
          :rules="[
            {
              required: true,
              pattern: usernamePattern,
              validator: async () => await checkUsernameAvailability(),
              message: usernameIsValid
                ? 'This username already exists.'
                : 'Username must be 8 to 15 characters (a-zA-Z0-9_-)',
            },
          ]"
        />
        <van-field
          v-model="credentials.password"
          type="password"
          label="Password"
          right-icon="checked"
          :style="`${
            passwordIsStrong
              ? '--van-field-right-icon-color: green'
              : '--van-field-right-icon-color: transparent'
          }`"
          placeholder="Enter Password"
          autocomplete="new-password"
          :rules="[
            {
              required: true,
              validator: () => passwordIsStrong,
              message:
                'Must be 8 characters minimum, 1 upper, 1 lower, 1 special, 1 number',
            },
          ]"
        />
        <van-field
          v-model="credentials.confirmPassword"
          type="password"
          label="Confirm Password"
          :right-icon="`${passwordIsValid ? 'checked' : 'close'}`"
          :style="`--van-field-right-icon-color: ${
            passwordIsStrong ? (passwordIsValid ? 'green' : 'red') : 'transparent'
          }`"
          placeholder="Confirm Password"
          autocomplete="new-password"
          :rules="[
            {
              required: true,
              validator: () => passwordIsValid,
              message: 'Passwords must match',
            },
          ]"
        />
      </van-cell-group>
      <van-button
        type="primary"
        native-type="submit"
        :disabled="!(usernameAvailable && passwordIsValid)"
      >
        Signup
      </van-button>
      <router-link to="/login">I already have an account &rarr;</router-link>
    </van-form>
    <Transition name="van-slide-up">
      <div v-if="errorOnSubmit" class="notification error">{{ errorOnSubmit }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { showLoadingToast, showConfirmDialog } from "vant";

const router = useRouter();
const auth = useAuthStore();

const credentials = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});

const errorOnSubmit = ref(false);
const signupComplete = ref(false);

const goToHome = () => {
  showLoadingToast({
    message: "Logging in...",
    duration: 500,
  });
  router.push("/");
};

// Form validation
const usernamePattern = /^[a-zA-Z0-9]{1}(?:[_-]?[a-zA-Z0-9]){7,15}$/;
const usernameIsValid = computed(() => usernamePattern.test(credentials.username));
const usernameAvailable = ref(false);

const checkUsernameAvailability = async () => {
  const user = await auth.usernameExists(credentials.username);
  usernameAvailable.value = user ? false : true;
  return usernameAvailable.value;
};

const passwordIsStrong = computed(() => checkPasswordStrength());
const checkPasswordStrength = () => {
  const pw = credentials.password;
  const reqs = [
    /[A-Z]/, // has uppercase
    /[a-z]/, // has lowercase
    /[0-9]/, // has number
    /[^a-zA-Z0-9]/, // has special char
    /.{8,}/, // at least 8 chars
  ];
  return reqs.every((re) => re.test(pw));
};

const passwordIsValid = computed(() =>
  passwordIsStrong.value ? credentials.password === credentials.confirmPassword : false
);

const handleSubmit = async () => {
  const { error } = await auth.signupUser(credentials);
  if (error) {
    errorOnSubmit.value = error;
  } else {
    errorOnSubmit.value = false;
    signupComplete.value = true;
    showConfirmDialog({
      message: "Registration Complete",
      confirmButtonText: "Go to Homepage",
      showCancelButton: false,
      onConfirm: () => goToHome(),
    });
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
