'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../assets/contextAPI/ProfileContext";
import Image from "next/image";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 relative rounded-md">
        <div
          className="absolute inset-0 bg-cover bg-center bg-orange-300"
          // add overlay to make text more readable
          // style={{ backgroundImage: "url('/images/bg1.pngf')" }}
        />

        {/* Logo Image */}
        <div className="flex flex-col items-center justify-center relative z-10 mb-6">
          <Image
            src="/images/mypal.svg"
            width={200}
            height={200}
            alt="Logo"
            className="w-24 h-24 object-contain mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white shadow-md p-6 w-full max-w-sm rounded-md"
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
              autoComplete="email"
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

          {/* <div className="text-center mt-3 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-600 hover:underline">
              Register
            </Link>
          </div> */}
        </form>
      </div>
    </>
  );
};

export default Login;

