<template>
    <div class="root">
        <div v-if="signupComplete">
            <h2>Hello {{ credentials.username }}!</h2>
            <p>Thank you for registering!</p>
            <div class="notification success">
                <p>Registration successful.</p>
                <router-link to="/login">Login &rarr;</router-link>
            </div>
        </div>
        <form v-else @submit.prevent="handleSubmit">
            <div>
                <label for="signup-username">Username</label>
                <input v-model="credentials.username" id="signup-username" type="text" autocomplete="username" required>
            </div>
            <div>
                <label for="signup-password">Password</label>
                <input v-model="credentials.password" id="signup-password" :class="{ error: passwordMismatch }"
                    type="password" autocomplete="current-password" required>
            </div>
            <div>
                <label for="signup-confirm-password">Confirm Password</label>
                <input v-model="credentials.confirmPassword" id="signup-confirm-password"
                    :class="{ error: passwordMismatch }" type="password" autocomplete="current-password" required>
            </div>
            <button type="submit" :disabled="passwordMismatch">Signup</button>
            <router-link to="/login">I already have an account &rarr;</router-link>
        </form>
        <div v-if="errorOnSubmit" class="notification error">{{ errorOnSubmit }}</div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

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
    router.push('/');
}

const passwordMismatch = computed(() => credentials.password !== credentials.confirmPassword);

const handleSubmit = async () => {
    const { error } = await auth.signupUser(credentials);
    if (error) {
        errorOnSubmit.value = error;
    } else {
        errorOnSubmit.value = false;
        signupComplete.value = true;
    }
}

onBeforeMount(() => {
    if (auth.loggedIn) goToHome();
})
</script>

<style scoped>
div:has(input) {
    height: 5rem;
    padding: 0 2rem;
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
    letter-spacing: 0.5px;
}

label {
    display: block;
    text-align: left;
    margin-bottom: 0.2rem;
}

input {
    font-size: larger;
    padding: 0.5rem 1rem;
}

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
    /* inset: 0;
    margin: auto; */
}

.error {
    border: 1px solid red;
    box-shadow: 0 0 0.2rem palevioletred;
}
</style>