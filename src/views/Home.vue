<template>
  <div>
    <Header />
    <van-loading v-if="events === null" />
    <div v-else-if="events.length === 0" class="no-events">
      <van-empty description="No events" />
    </div>
    <ul v-else class="event-list">
      <li
        v-for="(ev, index) in events"
        :key="ev._id"
        :style="{ animationDelay: `${index * 200}ms`, position: 'relative' }"
        @click="
          () => {
            console.log(ev);
            selectedEvent = reactive(ev);
            showForm = true;
          }
        "
      >
        <h2>{{ ev.eventName }}</h2>
        <p>{{ ev.description }}</p>
        <p>
          {{ format(new Date(ev.startDate), "M/dd/yy HH:mm") }}
          <span v-if="ev.endDate != ev.startDate">
            to {{ format(new Date(ev.endDate), "M/dd/yy HH:mm") }}</span
          >
        </p>
        <div :style="{ top: '4.5rem', right: '2.5rem', position: 'absolute' }">
          <van-button
            size="small"
            type="danger"
            icon="delete"
            @click.stop="() => confirmDelete(ev._id, ev.eventName)"
          />
        </div>
      </li>
    </ul>
    <van-button
      type="primary"
      icon="plus"
      size="large"
      @click="() => (showForm = true)"
    ></van-button>
    <van-popup
      v-model:show="showForm"
      :position="popupPosition"
      closeable
      round
      :style="popupStyle"
      @closed="
        () => {
          showForm = false;
          selectedEvent = {};
        }
      "
    >
      <h2>{{ selectedEvent.eventName ? "Update Event" : "Add Event" }}</h2>
      <Transition name="van-fade">
        <EventForm v-if="showForm" v-bind="selectedEvent" @event-saved="handleAdd" />
      </Transition>
    </van-popup>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useScreen } from "../composables/useScreen";
import { format } from "date-fns";
import {
  showSuccessToast,
  showLoadingToast,
  showNotify,
  closeNotify,
  showConfirmDialog,
} from "vant";
import { useAuthStore } from "../stores/auth";
import Header from "../components/Header.vue";
import EventForm from "../components/EventForm.vue";

const router = useRouter();
const auth = useAuthStore();
const { isLandscape } = useScreen();

const events = ref(null);
const showForm = ref(false);
const selectedEvent = reactive({});

const popupPosition = computed(() => (isLandscape.value ? "right" : "bottom"));
const popupStyle = computed(() => {
  return {
    height: isLandscape.value ? "100%" : "95%",
    width: isLandscape.value ? "95%" : "100%",
    maxWidth: isLandscape.value ? "640px" : "100%",
    padding: "1rem 2rem",
  };
});

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
      auth.logoutUser();
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

const handleAdd = () => {
  getEvents();
  showForm.value = false;
};

const confirmDelete = (id, eventName) => {
  showConfirmDialog({
    message: `Deleting ${eventName}... Are you sure you want to delete this event?`,
    confirmButtonColor: getComputedStyle(document.body).getPropertyValue(
      "--van-danger-color"
    ),
    confirmButtonText: "Yes, delete it.",
    cancelButtonText: "No, never mind.",
    onConfirm: () => {
      handleDelete(id);
    },
  });
};

const handleDelete = async (id) => {
  const url = `/api/events/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
  };
  try {
    const response = await fetch(url, options);

    if (response.ok) {
      showSuccessToast({
        message: "Event Deleted",
        wordBreak: "normal",
      });
      getEvents();
    }
  } catch (err) {
    console.error(err.message);
  }
};

onMounted(() => {
  // screen.update();
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
  max-height: 65vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.event-list li {
  margin: 0.5rem 2rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  border: 1px solid black;
  transform: translateY(100%);
  opacity: 0;
  animation: slideUp 500ms ease-out forwards;
}

.no-events {
  position: absolute;
  top: 10%;
  left: 50%;
  translate: -50% 0;
}

button {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 20%;
  padding: 1rem;
}

@keyframes slideUp {
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
