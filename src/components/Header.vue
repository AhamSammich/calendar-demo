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
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
    auth.logoutUser();
    router.push('/');
}
</script>

<style scoped>
header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 2rem;
}

header>div {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
}

nav {
    justify-self: flex-end;
}
</style>