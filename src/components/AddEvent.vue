<template>
  <div class="root">
    <van-form @submit="handleSubmit">
      <van-cell-group>
        <!-- Event Name -->
        <van-field
          v-model="newEvent.eventName"
          label="Name"
          label-align="top"
          placeholder="Enter event name"
          :rules="[{ required: true }]"
        />
        <!-- Description -->
        <van-field
          v-model="newEvent.description"
          type="textarea"
          label="Description"
          label-align="top"
          placeholder="Optional"
        />
      </van-cell-group>

      <van-cell-group>
        <!-- Date Range -->
        <!-- Use a calendar as datepicker -->
        <van-cell
          title="Select Date Range"
          title-style="text-align: left"
          is-link
          :value="dateRange"
          @click="showCalendar = true"
        />
        <div class="date-picker">
          <van-calendar
            v-model:show="showCalendar"
            :show-title="false"
            :show-confirm="false"
            type="range"
            :allow-same-day="true"
            :position="popupPosition"
            @confirm="onDateConfirm"
          />
        </div>
        <!-- Time Range -->
        <van-cell
          title="Start Time"
          title-style="text-align: left"
          is-link
          :value="format(newEvent.startDate, 'HH:mm')"
          @click="() => (showStartTime = true)"
        />
        <van-popup
          v-model:show="showStartTime"
          :position="popupPosition"
          round
          :style="popupStyle"
        >
          <div :style="{ width: '90vw', maxWidth: '320px', margin: '0 auto' }">
            <van-time-picker
              v-model="startTime"
              title="Start"
              @cancel="onStartTimeCancel"
              @confirm="onStartTimeConfirm"
            />
          </div>
        </van-popup>
        <van-cell
          title="End Time"
          title-style="text-align: left"
          is-link
          :value="format(newEvent.endDate, 'HH:mm')"
          @click="() => (showEndTime = true)"
        />
        <van-popup
          v-model:show="showEndTime"
          :position="popupPosition"
          round
          :style="popupStyle"
        >
          <div :style="{ width: '90vw', maxWidth: '320px', margin: '0 auto' }">
            <van-time-picker
              v-model="endTime"
              title="End"
              @cancel="onEndTimeCancel"
              @confirm="onEndTimeConfirm"
            />
          </div>
        </van-popup>
      </van-cell-group>
      <!-- Button -->
      <van-button type="primary" native-type="submit">Save</van-button>
    </van-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useScreenOrientation, useNow } from "@vueuse/core";
import { showSuccessToast, showConfirmDialog } from "vant";
import { useAuthStore } from "../stores/auth";

const emits = defineEmits(["event-added"]);

const auth = useAuthStore();
const { orientation } = useScreenOrientation();
const isLandscape = () => /landscape/.test(orientation.value);

const popupPosition = computed(() => (isLandscape() ? "right" : "bottom"));
const popupStyle = computed(() => {
  return {
    height: isLandscape() ? "100%" : "90%",
    width: isLandscape() ? "max-width" : "100%",
  };
});

const showCalendar = ref(false);
const showStartTime = ref(false);
const showEndTime = ref(false);

const now = new Date();
now.setSeconds(0, 0);
const plusHour = (h) => (Number(h) < 24 ? (Number(h) + 1) % 24 : h);
const getInitialTime = () => [now.getHours(), "00"];
const getInitialDate = () =>
  `${format(useNow().value, "M/dd")} - ${format(useNow().value, "M/dd")}`;

const dateRange = ref(getInitialDate());
const startTime = ref(getInitialTime());
const endTime = ref([plusHour(getInitialTime()[0]), getInitialTime()[1]]);

const newEvent = reactive({
  eventName: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
});
newEvent.startDate.setHours(...startTime.value, 0, 0);
newEvent.endDate.setHours(...endTime.value, 0, 0);

const resetForm = () => {
  dateRange.value = getInitialDate();
  startTime.value = getInitialTime();
  endTime.value = [plusHour(getInitialTime()[0]), getInitialTime()[1]];

  newEvent.eventName = "";
  newEvent.description = "";
  newEvent.startDate = new Date().setHours(...getInitialTime(), 0);
  newEvent.endDate = new Date().setHours(...getInitialTime(), 0);
};

const validateTime = (start, end) => {
  console.log("Validating: ", { start, end, result: start > end });
  if (start > end) {
    return false;
  }
  return true;
};

const onDateConfirm = (values) => {
  const [start, end] = values;
  showCalendar.value = false;
  newEvent.startDate = new Date(start);
  newEvent.startDate.setHours(...startTime.value);
  newEvent.endDate = new Date(end);
  newEvent.endDate.setHours(...endTime.value);
  dateRange.value = `${format(start, "M/dd")} - ${format(end, "M/dd")}`;
  console.log(newEvent);
};

const onStartTimeConfirm = () => {
  const newStart = new Date(newEvent.startDate);
  newStart.setHours(...startTime.value, 0);
  const isValid = validateTime(newStart, newEvent.endDate);
  if (!isValid) {
    endTime.value[0] = plusHour(startTime.value[0]);
    endTime.value[1] = startTime.value[1];
    newEvent.endDate.setHours(...endTime.value, 0);
  }
  newEvent.startDate = newStart;
  showStartTime.value = false;
  console.log(newEvent);
};

const onStartTimeCancel = () => {
  const date = newEvent.startDate;
  startTime.value = [format(date, "HH"), format(date, "mm")];
  showStartTime.value = false;
};

const onEndTimeConfirm = () => {
  const newEnd = new Date(newEvent.endDate);
  newEnd.setHours(...endTime.value, 0);
  const isValid = validateTime(newEvent.startDate, newEnd);
  if (!isValid) {
    showConfirmDialog({
      message:
        "Invalid selection. The end date/time must occur after the start date/time.",
      showCancelButton: false,
      confirmButtonText: "OK",
    });
    return;
  }
  newEvent.endDate = newEnd;
  showEndTime.value = false;
  console.log(newEvent);
};

const onEndTimeCancel = () => {
  const date = newEvent.endDate;
  endTime.value = [format(date, "HH"), format(date, "mm")];
  showEndTime.value = false;
};

const handleSubmit = async () => {
  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      showSuccessToast({
        message: "Event Saved",
        wordBreak: "normal",
      });
      emits("event-added");
      resetForm();
    }
  } catch (err) {
    console.error(err.message);
  }
};
</script>

<style scoped>
.root form {
  max-width: 100%;
  height: 500px;
}

.root form > button {
  position: absolute;
  bottom: 0;
  width: 90%;
}

.date-picker {
  color: black;
}

@media (orientation: landscape) {
  .root form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 300px;
  }

  .root form > div {
    display: grid;
    place-content: center;
  }

  .root form > button {
    right: 2rem;
    width: 20%;
  }
}
</style>
