<template>
  <div>
    <van-form @submit="handleSubmit">
      <van-cell-group inset>
        <!-- Event Name -->
        <van-field
          v-model="newEvent.eventName"
          label="Event"
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

        <!-- Date Range -->
        <!-- Use a calendar as datepicker -->
        <van-cell
          title="Select Date Range"
          title-style="text-align: left"
          is-link
          :value="date"
          @click="showCalendar = true"
        />
        <div class="date-picker">
          <van-calendar
            v-model:show="showCalendar"
            type="range"
            :allow-same-day="true"
            @confirm="onDateConfirm"
          />
        </div>
        <!-- Time Range -->
        <van-cell
          title="Start Time"
          title-style="text-align: left"
          is-link
          :value="formatTime(startTime)"
          @click="() => (showStartTime = true)"
        />
        <van-popup
          v-model:show="showStartTime"
          position="bottom"
          round
          :style="{ padding: '2rem' }"
        >
          <div :style="{ width: '90vw', maxWidth: '320px', margin: '0 auto' }">
            <van-time-picker
              v-model="startTime"
              title="Start"
              @cancel="() => (showStartTime = false)"
              @confirm="onStartTimeConfirm"
            />
          </div>
        </van-popup>
        <van-cell
          title="End Time"
          title-style="text-align: left"
          is-link
          :value="formatTime(endTime)"
          @click="() => (showEndTime = true)"
        />
        <van-popup
          v-model:show="showEndTime"
          position="bottom"
          round
          :style="{ padding: '2rem' }"
        >
          <div :style="{ width: '90vw', maxWidth: '320px', margin: '0 auto' }">
            <van-time-picker
              v-model="endTime"
              title="End"
              @cancel="() => (showEndTime = false)"
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
import { reactive, ref } from "vue";
import { format } from "date-fns";
import { showSuccessToast } from "vant";
import { useAuthStore } from "../stores/auth";

const emits = defineEmits(["event-added"]);

const auth = useAuthStore();

const showCalendar = ref(false);
const showStartTime = ref(false);
const showEndTime = ref(false);
const now = new Date();
const date = ref(`${format(now, "M/dd")} - ${format(now, "M/dd")}`);

const startTime = ref([format(now, "HH"), format(now, "mm")]);
const endTime = ref(startTime.value);

const formatTime = (time) => time.join(":");

const newEvent = reactive({
  eventName: "",
  description: "",
  startDate: format(now, "MM/dd/yy"),
  endDate: format(now, "MM/dd/yy"),
  startTime: formatTime(startTime.value),
  endTime: formatTime(endTime.value),
});

const onDateConfirm = (values) => {
  const [start, end] = values;
  showCalendar.value = false;
  newEvent.startDate = format(start, "MM/dd/yy");
  newEvent.endDate = format(end, "MM/dd/yy");
  date.value = `${format(start, "M/dd")} - ${format(end, "M/dd")}`;
  console.log(newEvent);
};

const onStartTimeConfirm = () => {
  newEvent.startTime = formatTime(startTime.value);
  showStartTime.value = false;
  console.log(newEvent);
};

const onEndTimeConfirm = () => {
  newEvent.endTime = formatTime(endTime.value);
  showEndTime.value = false;
  console.log(newEvent);
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

    const json = await response.json();

    if (response.ok) {
      showSuccessToast({
        message: "Event Saved",
        wordBreak: "normal",
      });
      emits("event-added");
    }
  } catch (err) {
    console.error(err.message);
  }
};
</script>

<style scoped>
form {
  max-width: 100%;
}

.date-picker {
  color: black;
}
</style>
