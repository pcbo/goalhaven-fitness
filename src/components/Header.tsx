import { Link } from "react-scroll";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex h-14 max-w-screen-2xl items-center">
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
        </div>
      </nav>
    </header>
  );
};