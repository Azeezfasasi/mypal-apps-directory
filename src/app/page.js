'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../assets/contextAPI/ProfileContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const profileCtx = useProfile() || {};
  const { loginProfile, loading } = profileCtx;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginProfile({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/background1.jpg')" }}
        />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white shadow-lg rounded p-6 w-full max-w-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
            Login to Your Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-800 text-sm p-2 rounded mb-3">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-base outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-base outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>
          <div className="text-left mt-0 mb-3 text-sm text-gray-600">
            Forgot password?{" "}
            <Link href="#" className="text-orange-600 hover:underline">
              Reset
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-medium py-2 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-3 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-600 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;

