import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { supabase } from "@/app/lib/supabaseClient";

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
          const { data } = await axios.post("/api/login", credentials);

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
              error instanceof Error ? error.message : "Invalid credentials",
            loading: false,
          });
          return false; // Login failed
        }
      },

      // Logout function
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, error: null }); // Reset state and remove user from persisted storage
      },
    }),
    {
      name: "user-storage", // The key used to store the data in localStorage
    }
  )
);
