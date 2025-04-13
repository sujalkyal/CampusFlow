"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="w-full px-6 py-4 shadow-md bg-gradient-to-r from-[#3a3153] to-[#5f43b2] flex items-center justify-between ">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#b1aebb] rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          </svg>
        </div>
        <span className="text-2xl font-semibold text-[#fefdfd] tracking-tight">YourBrand</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 text-sm font-medium text-[#fefdfd]">
        <Link href="/dashboard" className="hover:text-[#b1aebb] transition">Dashboard</Link>
        <Link href="/about" className="hover:text-[#b1aebb] transition">About Us</Link>
        <Link href="/contact" className="hover:text-[#b1aebb] transition">Contact</Link>
      </div>

      {/* Profile and Logout */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#fefdfd] overflow-hidden">
          <img src="/api/placeholder/40/40" alt="User" className="object-cover w-full h-full" />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="flex items-center gap-2 bg-[#fefdfd] text-[#3a3153] font-semibold px-4 py-2 rounded-full hover:bg-[#b1aebb] hover:text-white transition hover:cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
