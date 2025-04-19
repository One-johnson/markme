"use client";

import { useUserStore } from "@/app/stores/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/login"); // Redirect to login page
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Log Out
    </Button>
  );
};
