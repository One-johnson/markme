"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/app/stores/authStore";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Icons for hamburger

const MenuBar = () => {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [isAvatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = useMemo(() => {
    if (user?.username) {
      const usernameParts = user.username.split(" ");
      return usernameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    }
    return "";
  }, [user?.username]);

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false); // close mobile nav when navigating
  };

  const toggleAvatarDropdown = () => {
    setAvatarDropdownOpen(!isAvatarDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-black text-white px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between relative gap-4">
      {/* Top Row */}
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Username */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-sm md:text-md font-semibold text-gray-200"
        >
          👋 Welcome, {user?.username}
        </motion.div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:block md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6 font-semibold text-sm md:text-base">
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => handleNavigation("/pages/classes")}
                className="cursor-pointer"
              >
                Classes
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => handleNavigation("/pages/students")}
                className="cursor-pointer"
              >
                Students
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => handleNavigation("/pages/teachers")}
                className="cursor-pointer"
              >
                Teachers
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => handleNavigation("/pages/parents")}
                className="cursor-pointer"
              >
                Parents
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Dropdown Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden flex flex-col gap-2 font-medium text-sm"
          >
            <button onClick={() => handleNavigation("/pages/classes")}>
              Classes
            </button>
            <button onClick={() => handleNavigation("/pages/students")}>
              Students
            </button>
            <button onClick={() => handleNavigation("/pages/teachers")}>
              Teachers
            </button>
            <button onClick={() => handleNavigation("/pages/parents")}>
              Parents
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      {/* Avatar - hidden on mobile when hamburger is open */}
      {(!mobileMenuOpen || typeof window === "undefined") && (
        <div className="relative flex justify-end md:flex">
          <button onClick={toggleAvatarDropdown} className="flex items-center">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user?.username}`}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>

          {isAvatarDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-black shadow-lg rounded-lg p-2 z-50">
              <div className="p-2">
                <div className="font-semibold">{user?.username}</div>
                <div className="text-sm text-gray-600">{user?.email}</div>
              </div>
              <div className="border-t border-gray-300"></div>
              <div className="p-2">
                <button
                  onClick={logout}
                  className="w-full text-left text-red-600 hover:bg-gray-200 p-1 rounded"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuBar;
