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
          title-style="text-align: left; color: var(--van-primary-color);"
          is-link
          :value="dateRange"
          @click="showCalendar = true"
        />
        <van-calendar
          v-model:show="showCalendar"
          :show-title="false"
          :show-confirm="false"
          type="range"
          :allow-same-day="true"
          :position="popupPosition"
          @confirm="onDateConfirm"
        />
        <!-- Time Range -->
        <van-cell
          title="Start Time"
          title-style="text-align: left; color: var(--van-primary-color);"
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
          title-style="text-align: left; color: var(--van-primary-color);"
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

<script setup lang="js">
import { reactive, ref, computed } from "vue";
import { format } from "date-fns";
import { useScreen } from "../composables/useScreen";
import { showSuccessToast, showConfirmDialog } from "vant";
import { useAuthStore } from "../stores/auth";

const props = defineProps(["eventName", "description", "startDate", "endDate", "_id"]);
const emits = defineEmits(["event-saved"]);

const auth = useAuthStore();
const {isLandscape} = useScreen();


const popupPosition = computed(() => (isLandscape.value ? "right" : "bottom"));
const popupStyle = computed(() => {
  return {
    height: isLandscape.value ? "100%" : "max-content",
    width: isLandscape.value ? "max-content" : "100%",
  };
});

const showCalendar = ref(false);
const showStartTime = ref(false);
const showEndTime = ref(false);

const now = new Date();
const propsStartDate = props.startDate ? new Date(props.startDate) : undefined;
const propsEndDate = props.endDate ? new Date(props.endDate) : undefined;


const newEvent = reactive({
  eventName:    props.eventName || "",
  description:  props.description || "",
  startDate:    propsStartDate || now,
  endDate:      propsEndDate || now,
});
// const allDay = computed(() => newEvent.startDate? as )

now.setSeconds(0, 0);
const plusHour = (h) => (Number(h) < 24 ? (Number(h) + 1) % 24 : h);
const getInitialTime = () => [now.getHours(), "00"];
const getInitialDate = () =>
`${format(propsStartDate || now, "M/dd")} - ${format(propsEndDate || now, "M/dd")}`;

const dateRange = ref(getInitialDate());
const startTime = ref(getInitialTime());
const endTime = ref([plusHour(getInitialTime()[0]), getInitialTime()[1]]);

if (!props.startDate) {
  newEvent.startDate.setHours(...startTime.value, 0, 0);
  newEvent.endDate.setHours(...endTime.value, 0, 0);
}

const resetForm = () => {
  dateRange.value = getInitialDate();
  startTime.value = getInitialTime();
  endTime.value = [plusHour(getInitialTime()[0]), getInitialTime()[1]];

  newEvent.eventName   = props.eventName || "";
  newEvent.description = props.description || "";
  newEvent.startDate   = propsStartDate || now;
  newEvent.endDate     = propsEndDate || now;
};

function validateTime(
  start,
  end,
  options = { validIf: undefined, ifInvalid: undefined }
) {
  const { validIf, ifInvalid } = options;
  const validCondition = validIf || end >= start;
  if (validCondition) return true;

  ifInvalid?.();
  return false;
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

const createRequest = () => {
  const url = `/api/events/${props._id || ""}`;
  const method = props._id ? "PATCH" : "POST";
  const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(newEvent),
    };
  return [url, options];
}

const handleSubmit = async () => {
  try {
    const response = await fetch(...createRequest());

    if (response.ok) {
      showSuccessToast({
        message: "Event Saved",
        wordBreak: "normal",
      });
      emits("event-saved");
      resetForm();
    }
  } catch (err) {
    console.error(err.message);
  }
};
</script>

<style scoped>
.root form {
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

@media (orientation: landscape) and (height < 720px) {
  .root form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-height: 300px;
    max-width: 600px;
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
