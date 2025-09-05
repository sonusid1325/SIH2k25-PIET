"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  GraduationCap,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Home,
  Brain,
  School,
  Star,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, profileCompleted } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  const closeMobileMenu = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOutUser();
    if (!error) {
      router.push("/");
    }
  };

  const publicNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Demo", href: "/demo", icon: Star },
    { name: "Colleges", href: "/college-exam-explorer", icon: School },
  ];

  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Assessment", href: "/career-assessment", icon: Brain },
    { name: "Colleges", href: "/college-exam-explorer", icon: School },
  ];

  const navItems =
    user && profileCompleted ? authenticatedNavItems : publicNavItems;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    }
  }, [router, isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const ThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href={user && profileCompleted ? "/dashboard" : "/"}
            className="flex items-center space-x-2 flex-shrink-0"
            onClick={closeMobileMenu}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-orange">Skill Bridge</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            <div className="relative" ref={themeDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="w-9 px-0"
              >
                <ThemeIcon />
              </Button>

              {isThemeDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background rounded-md shadow-lg border py-1 z-50 animate-in fade-in-0 zoom-in-95">
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => {
                      setTheme("light");
                      setIsThemeDropdownOpen(false);
                    }}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => {
                      setTheme("dark");
                      setIsThemeDropdownOpen(false);
                    }}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => {
                      setTheme("system");
                      setIsThemeDropdownOpen(false);
                    }}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </button>
                </div>
              )}
            </div>

            {user && profileCompleted ? (
              /* User Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white text-xs font-semibold">
                    {(user.displayName || "U").charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-background rounded-md shadow-lg border py-1 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Link href="/profile">
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                    </Link>
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors text-red-600"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-orange hover:bg-orange/90 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden w-9 px-0"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Navigation Backdrop */}
        {(isOpen || isClosing) && (
          <div
            className={`fixed inset-0 mobile-nav-backdrop z-40 md:hidden transition-opacity duration-200 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={toggleMenu}
          />
        )}

        {/* Mobile Navigation */}
        {(isOpen || isClosing) && (
          <div
            className={`relative z-50 md:hidden mobile-nav transition-all duration-200 ${
              isClosing
                ? "opacity-0 transform -translate-y-2"
                : "opacity-100 transform translate-y-0"
            }`}
          >
            <div className="py-4 space-y-2">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={closeMobileMenu}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}

              <div className="border-t pt-2 mt-4">
                {/* Theme Selection */}
                <div className="px-2 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Theme</p>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-3 w-3 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-3 w-3 mr-1" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-3 w-3 mr-1" />
                      Auto
                    </Button>
                  </div>
                </div>

                {/* User Actions */}
                {user && profileCompleted ? (
                  <div className="space-y-1 pt-2">
                    <div className="px-2 py-2 border-b mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white text-xs font-semibold">
                          {(user.displayName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={closeMobileMenu}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={() => {
                        closeMobileMenu();
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        className="w-full bg-orange hover:bg-orange/90 text-white"
                        onClick={closeMobileMenu}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
