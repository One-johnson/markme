"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/app/utils/useClickOutside";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/app/components/LogoutButton";
import { useUserStore } from "@/app/stores/authStore";

import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import NavLinks from "@/app/components/NavLinks";

const MenuBar = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [isAvatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    dropdownRef,
    () => setAvatarDropdownOpen(false),
    isAvatarDropdownOpen
  );

  const initials = useMemo(() => {
    if (user?.username) {
      const usernameParts = user.username.split(" ");
      return usernameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    }
    return "";
  }, [user?.username]);

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
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
        <NavLinks onNavigate={handleNavigation} />
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
            <button onClick={() => handleNavigation("/pages/admin/classes")}>
              Classes
            </button>
            <button onClick={() => handleNavigation("/pages/admin/students")}>
              Students
            </button>
            <button onClick={() => handleNavigation("/pages/admin/teachers")}>
              Teachers
            </button>
            <button onClick={() => handleNavigation("/pages/admin/parents")}>
              Parents
            </button>
            <button onClick={() => handleNavigation("/pages/admin/attendance")}>
              Attendance
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex justify-end md:flex">
        <button onClick={toggleAvatarDropdown} className="flex items-center">
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user?.username}`}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>

        <AnimatePresence>
          {isAvatarDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-10 w-60 bg-white text-black shadow-lg rounded-lg p-2 z-50"
            >
              <div className="p-2">
                <div className="font-semibold">{user?.username}</div>
                <div className="text-sm text-gray-600">{user?.email}</div>
              </div>
              <div className="border-t border-gray-300 mt-2"></div>
              <div className="p-2 mt-2">
                <LogoutButton
                  onAfterLogout={() => setAvatarDropdownOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MenuBar;
