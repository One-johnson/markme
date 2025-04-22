"use client";

import { useMemo } from "react";
import { useUserStore } from "@/app/stores/authStore";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/app/components/LogoutButton";
import NavLinks from "@/app/components/NavLinks";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const MenuBar = () => {
  const { user } = useUserStore();
  const router = useRouter();

  const initials = useMemo(() => {
    if (user?.username) {
      const usernameParts = user.username.split(" ");
      return usernameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    }
    return "";
  }, [user?.username]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-black text-white px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between relative gap-4">
      {/* Top Row */}
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Username */}
        <div className="text-sm md:text-md font-semibold text-gray-200">
          😊 Welcome, {user?.username}
        </div>

        {/* Mobile Dropdown Menu (Hamburger) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2" aria-label="Toggle Menu">
                <Menu className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleNavigation("/pages/admin/dashboard")}
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/pages/admin/classes")}
              >
                Classes
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/pages/admin/students")}
              >
                Students
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/pages/admin/teachers")}
              >
                Teachers
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/pages/admin/parents")}
              >
                Parents
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/pages/admin/attendance")}
              >
                Attendance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:block md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <NavLinks onNavigate={handleNavigation} />
      </div>

      {/* Avatar Dropdown Menu */}
      <div className="relative flex justify-end md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center focus:outline-none">
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${user?.username}`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="font-semibold">{user?.username}</div>
              <div className="text-xs text-gray-600">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MenuBar;
