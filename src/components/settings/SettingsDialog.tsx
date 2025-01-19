import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, ChevronDown } from "lucide-react";
import { GoalsForm } from "./GoalsForm";
import { Link as ScrollLink } from "react-scroll";

export const SettingsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="fixed top-2 right-2 z-50 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>Settings & Navigation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <ScrollLink
              to="fasting"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
              className="cursor-pointer text-sm hover:text-primary"
            >
              Fasting Tracker
            </ScrollLink>
            <ScrollLink
              to="weight"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
              className="cursor-pointer text-sm hover:text-primary"
            >
              Weight Tracker
            </ScrollLink>
            <ScrollLink
              to="workout"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
              className="cursor-pointer text-sm hover:text-primary"
            >
              Workout Tracker
            </ScrollLink>
            <ScrollLink
              to="reading"
              spy={true}
              smooth={true}
              offset={-20}
              duration={500}
              className="cursor-pointer text-sm hover:text-primary"
            >
              Reading Tracker
            </ScrollLink>
          </div>
          <GoalsForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};