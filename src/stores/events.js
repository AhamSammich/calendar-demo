import { defineStore } from "pinia";

export const useEventStore = defineStore("events", {
  state: () => ({
    events: null,
    error: null,
  }),
  getters: {
    // get events by day
    // get events by week
    // get events by month
    // get all events
  },
  actions: {
    async fetchEvents(token) {
      try {
        const response = await fetch("/api/events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          this.error = null;
          this.events = json;
        } else {
          const { error } = json;
          this.error = error;
        }
      } catch (err) {
        this.error = err;
      }
    },
    async deleteEvent(id, token) {
      const url = `/api/events/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(url, options);

        if (response.ok) {
          this.error = null;
          this.fetchEvents(token);
        }
      } catch (err) {
        this.error = { error: err.message };
        console.error(err.message);
      }
    },
  },
});
