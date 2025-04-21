"use client";

import { useUserStore } from "@/app/stores/authStore";
import MenuBar from "@/app/components/MenuBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useUserStore((state) => state); // Get the user from the store

  return (
    <div>
      {/* Conditionally render the MenuBar only for admins */}
      {user?.role === "ADMIN" && <MenuBar />}

      <main className="p-8">{children}</main>
    </div>
  );
}
