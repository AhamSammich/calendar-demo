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
      try {
        const response = await fetch("/api/users/login", {
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
          // this.currentUser = await response.json();
          // this.loggedIn = true;
          console.log(`Successfully registered as ${this.username}.`)
        } else {
          throw Error("Unable to register. Please try again later.")
        }
        return { user: this.currentUser };
      } catch (err) {
        console.log(err);
        return { error: err.message };
      }
    },
    logoutUser() {
        // return variables in state() to initial values
        this.$reset();
        console.log('Logged out.');
    }
  },
});
