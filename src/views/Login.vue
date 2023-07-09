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
        <div v-if="errorOnSubmit" class="error">{{ errorOnSubmit }}</div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const credentials = reactive({
    username: "",
    password: "",
});

const errorOnSubmit = ref(false);

const goToHome = () => {
    router.push('/');
}

const handleSubmit = async () => {
    const {user, error } = await auth.loginUser(credentials);
    if (error) errorOnSubmit.value = error;
    if (user) goToHome();
}

</script>

<style scoped>
div:has(input) {
    height: 5rem;
    padding: 0 2rem;
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

.error {
    position: absolute;
    bottom: 2rem;
    padding: 2rem;
    border: 1px solid red;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.2rem palevioletred;
}
</style>