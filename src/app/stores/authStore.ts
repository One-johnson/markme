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
  accessToken: string | null; // 👈 Add this
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  syncSession: () => Promise<void>; // 👈 Add syncSession
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabaseBrowser.auth.signInWithPassword(
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (error || !data.session) {
            set({ error: error?.message || "Login failed", loading: false });
            return false;
          }

          // 👇 Optionally fetch user details from your backend
          const response = await axios.get(
            `/api/users?email=${credentials.email}`
          );
          const backendUser = response.data;

          set({
            user: backendUser,
            accessToken: data.session.access_token, // 👈 Save token here
            loading: false,
          });

          return true;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unknown error",
            loading: false,
          });
          return false;
        }
      },

      logout: async () => {
        await supabaseBrowser.auth.signOut();
        set({ user: null, accessToken: null, error: null });
      },

      // Sync session with Supabase on app load or refresh
      syncSession: async () => {
        const { data } = await supabaseBrowser.auth.getSession();
        if (data.session) {
          try {
            const email = data.session.user.email;
            const response = await axios.get(`/api/users?email=${email}`);
            const backendUser = response.data;

            set({
              user: backendUser,
              accessToken: data.session.access_token,
            });
          } catch {
            set({ error: "Failed to sync session" });
          }
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);
