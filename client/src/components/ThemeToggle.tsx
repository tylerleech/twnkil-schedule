import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "soft" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "soft" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "soft");
    
    // Add the appropriate class
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (initialTheme === "soft") {
      document.documentElement.classList.add("soft");
    }
  }, []);

  const changeTheme = (newTheme: "light" | "soft" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "soft");
    
    // Add the appropriate class
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "soft") {
      document.documentElement.classList.add("soft");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "soft":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-theme-toggle">
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")} data-testid="menu-theme-light">
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("soft")} data-testid="menu-theme-soft">
          <Sparkles className="h-4 w-4 mr-2" />
          Soft
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")} data-testid="menu-theme-dark">
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
