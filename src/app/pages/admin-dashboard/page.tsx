import React from "react";
import MenuBar from "@/app/components/MenuBar";

export default function AdminDashboard() {
  return (
    <div>
      <MenuBar /> {/* Render MenuBar here */}
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
      {/* Add more components or sections here */}
    </div>
  );
}
