"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
  
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className="text-indigo-800 font-bold">
                <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12 L18 6 L12 12 L6 6 L0 12" stroke="#5E35B1" strokeWidth="2" fill="none" />
                  <text x="32" y="16" fontFamily="Arial" fontSize="16" fontWeight="600" fill="#5E35B1">himalayas</text>
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 mb-3">Sign in</h1>
          <p className="text-gray-600 mb-8">Welcome back! Please sign in to access your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-indigo-800 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white p-3 rounded-md hover:bg-indigo-900 flex items-center justify-center"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="white"/>
              </svg>
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account? <a href="/signup" className="text-indigo-800 hover:underline">Sign up</a>
          </div>
        </div>
      </div>

      {/* Right side with purple background */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center">
        <div className="w-full h-full bg-indigo-600 opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="150" fill="white" fillOpacity="0.1" />
            <circle cx="400" cy="150" r="100" fill="white" fillOpacity="0.1" />
            <circle cx="100" cy="350" r="80" fill="white" fillOpacity="0.1" />
          </svg>
        </div>
      </div>
    </div>
  );
}