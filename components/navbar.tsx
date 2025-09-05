"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
    if (isOpen && !isClosing) {
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
      const target = event.target as Node;

      // Close theme dropdown
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(target)
      ) {
        setIsThemeDropdownOpen(false);
      }

      // Close user dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    // Only add listener when dropdowns are open
    if (isThemeDropdownOpen || isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeDropdownOpen, isUserDropdownOpen]);

  // Close mobile menu when route changes (only when clicking nav links)
  // Removed automatic route change listener to prevent unwanted closes

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && !isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isClosing]);

  const ThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link
              href={user && profileCompleted ? "/dashboard" : "/"}
              className="flex items-center space-x-2 flex-shrink-0"
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
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white text-xs font-semibold">
                        {(user.displayName || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
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
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Backdrop */}
      {(isOpen || isClosing) && (
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isOpen && !isClosing ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange/5 to-orange/10">
          <Link
            href={user && profileCompleted ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-bold text-orange">Skill Bridge</h1>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={toggleMenu}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User Section - Show at top if logged in */}
          {user && profileCompleted && (
            <div className="mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange/5 to-orange/10 border border-orange/20 mb-4">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover border-2 border-orange/30"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white font-semibold shadow-lg text-lg">
                      {(user.displayName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
              Navigation
            </p>
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl hover:bg-accent/50 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                  onClick={closeMobileMenu}
                >
                  <div className="p-2.5 rounded-xl bg-orange/10 group-hover:bg-orange/20 transition-colors">
                    <item.icon className="h-5 w-5 text-orange" />
                  </div>
                  <span className="text-base font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2 mb-3">
              Appearance
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  theme === "light"
                    ? "bg-orange text-white shadow-lg"
                    : "bg-accent/30 hover:bg-accent/50"
                }`}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-5 w-5 mb-2" />
                <span className="text-xs font-medium">Light</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  theme === "dark"
                    ? "bg-orange text-white shadow-lg"
                    : "bg-accent/30 hover:bg-accent/50"
                }`}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-5 w-5 mb-2" />
                <span className="text-xs font-medium">Dark</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  theme === "system"
                    ? "bg-orange text-white shadow-lg"
                    : "bg-accent/30 hover:bg-accent/50"
                }`}
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-5 w-5 mb-2" />
                <span className="text-xs font-medium">Auto</span>
              </button>
            </div>
          </div>

          {/* User Actions or Auth Buttons */}
          {user && profileCompleted ? (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2 mb-3">
                Account
              </p>
              <div className="space-y-2">
                <Link href="/profile">
                  <div
                    className="flex items-center space-x-4 px-4 py-4 rounded-xl hover:bg-accent/50 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
                    onClick={closeMobileMenu}
                  >
                    <div className="p-2.5 rounded-xl bg-accent/30 group-hover:bg-accent/50 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Profile Settings</span>
                  </div>
                </Link>

                <button
                  className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 active:scale-[0.98] group text-red-600 dark:text-red-400"
                  onClick={() => {
                    closeMobileMenu();
                    handleSignOut();
                  }}
                >
                  <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2 mb-3">
                Get Started
              </p>
              <div className="space-y-3 ">
                <Link href="/login">
                  <button
                    className="w-full py-4 px-4 rounded-xl border border-border bg-background hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] font-medium text-left"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button
                    className="w-full py-4 px-4 rounded-xl bg-orange hover:from-orange/90 hover:to-orange/80 text-white font-medium shadow-lg transition-all duration-200 active:scale-[0.98]"
                    onClick={closeMobileMenu}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
