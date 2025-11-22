import { defineStore } from "pinia";
import axios from "axios";

interface User {
  email: string;
  nickname?: string;
  gender?: string;
  birthDate?: string;
}

interface UserState {
  accessToken: string | null;
  user: User | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    accessToken: localStorage.getItem("accessToken"),
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },

  actions: {
    saveToken(token: string) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },

    logout() {
      this.accessToken = null;
      this.user = null;
      localStorage.removeItem("accessToken");
      delete axios.defaults.headers.common.Authorization;
    },
  },
});
