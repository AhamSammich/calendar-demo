import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Reset to these initial values when user is logged out 
    currentUser: null,
    loggedIn: false,
  }),
  getters: {
    userId: (state) => state.currentUser?._id,
    username: (state) => state.currentUser?.username,
    token: (state) => state.currentUser?.token,
  },
  actions: {
    async loginUser(credentials) {
      const response = await fetch("https://calendar-api-6rcdoyqdaq-uc.a.run.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        this.currentUser = await response.json();
        this.loggedIn = true;
        console.log(`Logged in as ${this.username}.`)
      }
      return this.currentUser;
    },
    logoutUser() {
        // return variables in state() to initial values
        this.$reset();
        console.log('Logged out.');
    }
  },
});
