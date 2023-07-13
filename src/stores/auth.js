import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

const STORE_NAME = "cal-auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Reset to these initial values when user is logged out 
    currentUser: useStorage(STORE_NAME, {}, localStorage, {mergeDefaults: true}),
  }),
  getters: {
    loggedIn: (state) => !!state.currentUser.token,
    userId: (state) => state.currentUser?._id,
    username: (state) => state.currentUser?.username,
    token: (state) => state.currentUser?.token,
    usernameExists: (state) => async (username) => {
      try {
        const response = await fetch(`/api/users/${username}`);
        const { user } = await response.json();
        return user;
      } catch (err) {
        console.log(err);
        return { error: err.message };
      }
    }
  },
  actions: {
    async loginUser(credentials) {
      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (response.ok) {
          const user = await response.json();
          this.currentUser = { ...user };
          console.log(`Logged in as ${this.username}.`)
        } else {
          throw Error("Unable to login. Please try again later.")
        }
        return { user: this.currentUser };
      } catch (err) {
        console.log(err);
        return { error: err.message };
      }
    },
    async signupUser(credentials) {
      try {
        const response = await fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (response.ok) {
          const user = await response.json();
          this.currentUser = { ...user };
          console.log(`Successfully registered as ${this.username}.`)
        } else {
          const json = await response.json();
          return json;
        }
        return { user: this.currentUser };
      } catch (err) {
        return { error: err.message };
      }
    },
    logoutUser() {
        this.currentUser = {};
        console.log('Logged out.');
    }
  },
});
