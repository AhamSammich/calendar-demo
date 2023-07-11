<template>
  <div>
    <h2>Events List</h2>
    <van-loading v-if="events === null" />
    <p v-else-if="events.length === 0">No events</p>
    <ul v-else class="event-list">
      <li
        v-for="(ev, index) in events"
        :key="ev._id"
        :style="{ animationDelay: `${index * 200}ms` }"
      >
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
import { onMounted, ref, watchEffect } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { showLoadingToast, showNotify, closeNotify } from "vant";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const events = ref(null);

const getEvents = async () => {
  try {
    const response = await fetch("/api/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      closeNotify();
      events.value = json;
    } else {
      events.value = false;
      const { error } = json;
      showNotify({
        type: "danger",
        message: error,
        duration: 0,
      });
    }
  } catch (err) {
    showNotify({
      type: "danger",
      message: err.message,
    });
  }
};

const goToLogin = () => {
  router.push("/login");
};

onMounted(() => {
  watchEffect(() => {
    if (auth.loggedIn) {
      getEvents();
    } else {
      events.value = null;
      showLoadingToast({
        message: "Logging out...",
        duration: 500,
      });
      goToLogin();
    }
  });
});

onBeforeRouteLeave(() => {
  closeNotify();
});
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
  transform: translateY(100%);
  opacity: 0;
  animation: slideUp 500ms ease-out forwards;
}

@keyframes slideUp {
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
