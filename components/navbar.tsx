"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap, BookOpen, Users, Award } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Career Guide", href: "/career-guide", icon: GraduationCap },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Resources", href: "/resources", icon: Award },
    { name: "About", href: "/about", icon: Users },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 animate-scale-in">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-orange text-white shadow-lg animate-pulse-orange">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">CareerPath</h1>
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
            <Button
              variant="outline"
              size="sm"
              className="animate-fade-in-up animate-delay-500"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-orange hover:opacity-90 text-white shadow-lg animate-fade-in-up animate-delay-500"
            >
              Get Started
            </Button>
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
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-96 opacity-100 pb-4"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}>
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
              <Button
                variant="outline"
                className="w-full animate-slide-in-left animate-delay-300"
              >
                Sign In
              </Button>
              <Button
                className="w-full bg-gradient-orange hover:opacity-90 text-white animate-slide-in-left animate-delay-500"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
