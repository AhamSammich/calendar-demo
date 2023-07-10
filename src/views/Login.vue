<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="login-username">Username</label>
                <input v-model="credentials.username" id="login-username" type="text" autocomplete="username" required>
            </div>
            <div>
                <label for="login-password">Password</label>
                <input v-model="credentials.password" id="login-password" type="password" autocomplete="current-password"
                    required>
            </div>
            <button type="submit">Login</button>
            <router-link to="/signup">I don't have an account &rarr;</router-link>
        </form>
        <div v-if="errorOnSubmit" class="notification error">{{ errorOnSubmit }}</div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const goToHome = () => {
    router.push('/');
}

const credentials = reactive({
    username: "",
    password: "",
});    

const errorOnSubmit = ref(false);

const handleSubmit = async () => {
    const { user, error } = await auth.loginUser(credentials);
    if (error) errorOnSubmit.value = error;
    if (user) {
        errorOnSubmit.value = false;
        goToHome();
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
    position: fixed;
    left: 0;
    right: 0;
    bottom: 2rem;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 0.5rem;
}

.error {
    border: 1px solid red;
    box-shadow: 0 0 0.2rem palevioletred;
}
</style>