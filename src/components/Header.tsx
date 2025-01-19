import { Link } from "react-scroll";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { SettingsDialog } from "./settings/SettingsDialog";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <Link
            to="fasting"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            Fasting
          </Link>
          <Link
            to="weight"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            Weight
          </Link>
          <Link
            to="workout"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            Workout
          </Link>
          <Link
            to="reading"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            Reading
          </Link>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-md">
                <Menu className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <SettingsDialog />
              </DropdownMenuItem>
              {/* Future auth items will go here */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};