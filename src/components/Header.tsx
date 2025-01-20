import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Link } from "react-scroll";
import { SettingsDialog } from "./settings/SettingsDialog";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 max-w-screen-2xl items-center justify-end px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-md">
              <Menu className="h-6 w-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link
                to="fasting"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="cursor-pointer"
              >
                Fasting
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="weight"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="cursor-pointer"
              >
                Weight
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="workout"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="cursor-pointer"
              >
                Workouts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="reading"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="cursor-pointer"
              >
                Reading
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsDialog />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};