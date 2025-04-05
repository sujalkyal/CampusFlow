"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const Navbar = () => {
  const router = useRouter();
  
  return (
    <nav className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#2F3C7E' }}>
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center">
        <div className="w-10 h-10 mr-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 234, 235, 0.2)' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-6 h-6"
            style={{ color: '#FBEAEB' }}
          >
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          </svg>
        </div>
        <span className="text-xl font-bold" style={{ color: '#FBEAEB' }}>YourBrand</span>
      </Link>
      
      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        <Link 
          href="/dashboard" 
          className="font-medium transition-colors duration-200 hover:opacity-80"
          style={{ color: '#FBEAEB' }}
        >
          Dashboard
        </Link>
        <Link 
          href="/about"
          className="font-medium transition-colors duration-200 hover:opacity-80"
          style={{ color: '#FBEAEB' }}
        >
          About Us
        </Link>
        <Link 
          href="/contact"
          className="font-medium transition-colors duration-200 hover:opacity-80"
          style={{ color: '#FBEAEB' }}
        >
          Contact Us
        </Link>
      </div>
      
      {/* User Profile and Logout */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: '#FBEAEB' }}>
          <img 
            src="/api/placeholder/40/40" 
            alt="User avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <button 
          className="flex items-center px-5 py-2 rounded-full font-medium transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: '#FBEAEB', color: '#2F3C7E' }}
          onClick={() => {
            // Handle logout logic here
            signOut({ callbackUrl: '/auth/signin' }); // redirect after logout
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-4 h-4 mr-2"
            style={{ color: '#2F3C7E' }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;