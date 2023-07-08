<template>
    <div>
        <h2>Events List</h2>
        <Loader v-if="events === null" />
        <p v-else-if="events.length === 0">No events</p>
        <ul v-else class="event-list">
            <li v-for="ev in events" :key="ev._id">
                <h3>{{ ev.eventName }}</h3>
                <p>{{ ev.description }}</p>
                <p>
                    {{ ev.startDate }}
                    <span v-if="ev.endDate != ev.startDate"> to {{ ev.endDate }}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Loader from "../components/Loader.vue";

const router = useRouter();
const auth = useAuthStore();
const events = ref(null);

const getEvents = () => {
    fetch("https://calendar-api-6rcdoyqdaq-uc.a.run.app/api/events", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${auth.token}`,
        }
    })
        .then(response => response.json())
        .then(json => events.value = json)
        .catch()
}

const goToLogin = () => {
    router.push('/login');
}

onMounted(() => {
    watchEffect(() => {
        if (auth.loggedIn) {
            getEvents();
        } else {
            events.value = null;
            goToLogin();
        }
    })
})
</script>

<style scoped>
.event-list {
    list-style-type: none;
    text-align: left;
}

.event-list li {
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    border: 1px solid white;
}
</style>