"use client";

import { useEffect } from "react";
import { listenToAuthChanges } from "@/app/stores/authStore";

export const AuthListener = () => {
  useEffect(() => {
    listenToAuthChanges();
  }, []);

  return null;
};
