import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface NavLinksProps {
  onNavigate: (path: string) => void;
}

const NavLinks = ({ onNavigate }: NavLinksProps) => (
  <NavigationMenu>
    <NavigationMenuList className="flex space-x-6 font-semibold text-sm md:text-base">
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/admin/dashboard")}
          className="cursor-pointer"
        >
          Dashboard
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/admin/classes")}
          className="cursor-pointer"
        >
          Classes
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/admin/students")}
          className="cursor-pointer"
        >
          Students
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/admin/teachers")}
          className="cursor-pointer"
        >
          Teachers
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/admin/parents")}
          className="cursor-pointer"
        >
          Parents
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/admin/attendance")}
          className="cursor-pointer"
        >
          Attendance
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

export default NavLinks;
