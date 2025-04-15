import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { supabase } from "@/app/lib/supabaseClient";

interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
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

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post("/api/login", credentials);
          set({ user: data.user, loading: false });
          return true;
        } catch (error) {
          console.error("Error logging in:", error);
          set({ error: "Invalid credentials", loading: false });
          return false; // Login failed
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },
    }),
    {
      name: "user-storage", // The key used to store the data in localStorage
    }
  )
);
