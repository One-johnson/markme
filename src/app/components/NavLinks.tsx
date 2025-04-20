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
          onClick={() => onNavigate("/pages/classes")}
          className="cursor-pointer"
        >
          Classes
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/students")}
          className="cursor-pointer"
        >
          Students
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/teachers")}
          className="cursor-pointer"
        >
          Teachers
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => onNavigate("/pages/parents")}
          className="cursor-pointer"
        >
          Parents
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

export default NavLinks;
