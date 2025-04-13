"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  // Define theme colors
  const themeColors = {
    primary: '#5f43b2', // Studio purple
    secondary: '#3a3153', // Mystique
    accent: '#b1aebb', // Gray Powder
    text: '#fefdfd', // Soft Peach
    hover: '#6f53c2', // Lighter purple for hover
  };

  return (
    <nav
      className="w-full px-6 py-4 shadow-md flex items-center justify-between"
      style={{
        background: `linear-gradient(to right, ${themeColors.secondary}, ${themeColors.primary})`,
      }}
    >
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: themeColors.accent }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            className="w-6 h-6"
          >
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          </svg>
        </div>
        <span
          className="text-2xl font-semibold tracking-tight"
          style={{ color: themeColors.text }}
        >
          YourBrand
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className="transition"
          style={{ color: themeColors.text }}
          onMouseEnter={(e) => (e.target.style.color = themeColors.accent)}
          onMouseLeave={(e) => (e.target.style.color = themeColors.text)}
        >
          Dashboard
        </Link>
        <Link
          href="/about"
          className="transition"
          style={{ color: themeColors.text }}
          onMouseEnter={(e) => (e.target.style.color = themeColors.accent)}
          onMouseLeave={(e) => (e.target.style.color = themeColors.text)}
        >
          About Us
        </Link>
        <Link
          href="/contact"
          className="transition"
          style={{ color: themeColors.text }}
          onMouseEnter={(e) => (e.target.style.color = themeColors.accent)}
          onMouseLeave={(e) => (e.target.style.color = themeColors.text)}
        >
          Contact
        </Link>
      </div>

      {/* Profile and Logout */}
      <div className="flex items-center space-x-4">
        <div
          className="w-10 h-10 rounded-full border-2 overflow-hidden"
          style={{ borderColor: themeColors.text }}
        >
          <img
            src="/api/placeholder/40/40"
            alt="User"
            className="object-cover w-full h-full"
          />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="flex items-center gap-2 font-semibold px-4 py-2 rounded-full transition"
          style={{
            backgroundColor: themeColors.text,
            color: themeColors.secondary,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = themeColors.accent;
            e.target.style.color = themeColors.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = themeColors.text;
            e.target.style.color = themeColors.secondary;
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
