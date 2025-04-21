"use client";

import { useUserStore } from "@/app/stores/authStore";
import MenuBar from "@/app/components/MenuBar";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  const { user } = useUserStore((state) => state); // Get the user from the store

  return (
    <div>
      {/* Conditionally render the MenuBar only for admins */}
      {user?.role === "ADMIN" && <MenuBar />}
      {/* Page title */}
      <h1 className="text-xl font-semibold p-4">{title}</h1>{" "}
      {/* Display the title */}
      {/* Content of the page with padding */}
      <main className="p-4">{children}</main>
    </div>
  );
}
