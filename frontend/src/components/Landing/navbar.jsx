import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add your theme toggle logic here
  };

  return (
    <nav className="w-full border-b bg-background px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="h-6 w-6 rounded bg-teal-500"></div>
            <span className="text-xl font-semibold text-foreground">GigCampus</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#marketplace" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Marketplace
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a 
            href="#previews" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Previews
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-9 w-9"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Hire Talent Button */}
          <Button 
            variant="ghost" 
            className="hidden sm:inline-flex text-sm font-medium bg-blue-900 hover:bg-blue-950 text-white"
          >
            Hire Talent
          </Button>

          {/* Find Gigs Button */}
          <Button 
            className="bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium px-6"
          >
            Find Gigs
          </Button>
        </div>

        {/* Mobile Menu Button (optional) */}
        <div className="md:hidden ml-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;