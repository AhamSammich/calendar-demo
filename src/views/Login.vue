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
        </form>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const credentials = reactive({
    username: "",
    password: "",
});

const goToHome = () => {
    router.push('/');
}

const handleSubmit = async () => {
    const user = await auth.loginUser(credentials);
    if (user) goToHome();
}

</script>

<style scoped>
div:has(input) {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

input {
    font-size: larger;
    padding: 0.5rem 1rem;
}
</style>