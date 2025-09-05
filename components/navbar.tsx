"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  User,
  LogOut,
  Brain,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profileCompleted } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    const { error } = await signOutUser();
    if (!error) {
      router.push("/");
    }
  };

  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Career Guide", href: "/career-guide", icon: GraduationCap },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Resources", href: "/resources", icon: Award },
    { name: "About", href: "/about", icon: Users },
  ];

  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
    { name: "Assessment", href: "/career-assessment", icon: Brain },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Resources", href: "/resources", icon: Award },
  ];

  const navItems =
    user && profileCompleted ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={user && profileCompleted ? "/dashboard" : "/"}
            className="flex items-center space-x-2 animate-scale-in"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange text-white shadow-lg animate-pulse-orange">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">
                nullsafecode
              </h1>
              <p className="text-xs text-muted-foreground">AI Career Advisor</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user && profileCompleted ? (
              // Authenticated user menu
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.displayName || "User"}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              // Public user menu
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="animate-fade-in-up animate-delay-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-orange hover:bg-orange/90 text-white shadow-lg animate-fade-in-up animate-delay-500"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-2 pt-4 border-t">
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-2 animate-slide-in-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4">
              {user && profileCompleted ? (
                // Authenticated user mobile menu
                <>
                  <div className="px-2 py-1 text-sm text-muted-foreground border-b pb-2">
                    Welcome, {user.displayName || "User"}
                  </div>
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start space-x-2 animate-slide-in-left animate-delay-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-2 animate-slide-in-left animate-delay-500"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                // Public user mobile menu
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full animate-slide-in-left animate-delay-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="w-full bg-orange hover:bg-orange/90 text-white animate-slide-in-left animate-delay-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
