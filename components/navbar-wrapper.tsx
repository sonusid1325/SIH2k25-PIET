"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { loading } = useAuth();

  // Pages where navbar should not be shown
  const noNavbarPages = ["/login", "/signup", "/profile-setup"];

  // Don't show navbar while auth is loading
  if (loading) {
    return null;
  }

  // Check if current page should show navbar
  const shouldShowNavbar = !noNavbarPages.includes(pathname);

  return shouldShowNavbar ? <Navbar /> : null;
}
