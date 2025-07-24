"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import AuthSlider from "../../../components/AuthSlider";
import Image from "next/image";
import logo from "../../../public/images/logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "", // ✅ Add role to formData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: AuthSlider */}
      <AuthSlider />

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#1E1B29] text-white">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <Image src={logo} alt="Company Logo" width={180} height={80} priority />
          </div>

          <h1 className="text-5xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-purple-400 hover:underline">
              Sign up
            </a>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="w-full">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500"
                placeholder="Email Address"
                required
              />
              <p className="text-sm text-gray-400 mt-1 text-left">Enter your Email</p>
            </div>

            {/* Role Dropdown */}
            <div className="w-full">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-900 p-3 rounded-lg text-white"
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Shift-Engineer">Shift-Engineer</option>
                <option value="User">User</option>
                <option value="End-User">End-User</option>
                <option value="Customer">Customer</option>
              </select>
              <p className="text-sm text-gray-400 mt-1 text-left">Select your Role</p>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500"
                placeholder="Password"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                )}
              </span>
              <p className="text-sm text-gray-400 mt-1 text-left">Enter your Password</p>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="/auth/forgot-password" className="text-purple-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-3 rounded-lg mt-4 hover:bg-purple-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
