import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { supabaseBrowser } from "@/app/utils/supabase/client";

interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      // Login function
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("/api/login", credentials);
          const { data } = response;

          if (data?.error) {
            set({
              error: data.error.message || "Login failed",
              loading: false,
            });
            return false;
          }

          if (data?.user) {
            set({ user: data.user, loading: false });
            return true;
          } else {
            set({
              error: "Login failed, no user data received",
              loading: false,
            });
            return false; // Login failed
          }
        } catch (error) {
          console.error("Error logging in:", error);
          set({
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
            loading: false,
          });
          return false; // Login failed
        }
      },

      // Logout function
      logout: async () => {
        await supabaseBrowser.auth.signOut();
        set({ user: null, error: null });
      },
    }),
    {
      name: "user-storage", 
    }
  )
);

// Listen to Supabase auth state changes to auto log out the user
export const listenToAuthChanges = () => {
  supabaseBrowser.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      // Automatically log out the user if the session expires or the user logs out
      useUserStore.getState().logout();
    }
  });
};
