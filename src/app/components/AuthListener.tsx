"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/app/utils/supabase/client";
import { useUserStore } from "@/app/stores/authStore";

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
    role?: string;
  };
}

// Define the User type
interface User {
  id: string;
  username: string;
  email: string;
  role: "STUDENT" | "ADMIN" | "TEACHER" | "PARENT";
}

const mapSupabaseUserToStoreUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    username: supabaseUser.user_metadata.username || "",
    email: supabaseUser.email || "", // Default to an empty string if email is undefined
    role: (["STUDENT", "ADMIN", "TEACHER", "PARENT"].includes(
      supabaseUser.user_metadata.role || "STUDENT"
    )
      ? supabaseUser.user_metadata.role
      : "STUDENT") as "STUDENT" | "ADMIN" | "TEACHER" | "PARENT", // Ensure role is one of the allowed values
  };
};

export const AuthListener = () => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const user = session?.user as SupabaseUser;
          if (user) {
            const mappedUser = mapSupabaseUserToStoreUser(user);
            setUser(mappedUser);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null); // Clear user state on sign out
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return null; // No UI to render
};
