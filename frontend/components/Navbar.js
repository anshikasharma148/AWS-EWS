"use client";
import { useState, useEffect } from "react";
import { Menu, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [lastShiftEngId, setLastShiftEngId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedEngId = localStorage.getItem("lastShiftEngId");

    if (storedUser) setUser(storedUser);
    if (storedEngId) setLastShiftEngId(storedEngId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 py-4 px-6 flex items-center justify-between transition duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        {pathname === "/dashboard" && (
          <span className="text-[#1E1B29] text-3xl font-bold">Dashboard</span>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        {/* Nav Links */}
        <div className="hidden lg:flex space-x-6 text-[#1E1B29] font-bold text-xl">
          {pathname !== "/dashboard" && (
            <Link href="/dashboard" className="hover:text-gray-700 font-extrabold">
              Dashboard
            </Link>
          )}
          <Link href="/aws" className="hover:text-gray-700 font-extrabold">AWS</Link>
          <Link href="/ews" className="hover:text-gray-700 font-extrabold">EWS</Link>
          <Link href="/scada" className="hover:text-gray-700">SCADA</Link>
          <Link href="/reports" className="hover:text-gray-700">Reports</Link>
          <Link href="/trends" className="hover:text-gray-700">Trends</Link>
          <Link href="/configuration" className="hover:text-gray-700">Configuration</Link>
          <Link href="/settings" className="hover:text-gray-700">Settings</Link>
        </div>

        {/* Shift Engineer ID */}
        <div className="text-[#1E1B29] text-lg font-medium">
          <b>Shift Eng. ID:</b> {lastShiftEngId || "SE02"}
        </div>

        {/* User Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <UserCircle size={40} className="text-gray-500" />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#1E1B29] hover:text-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md lg:hidden flex flex-col py-4">
          {pathname !== "/dashboard" && (
            <Link href="/dashboard" className="px-6 py-2 hover:bg-gray-100 font-extrabold">
              Dashboard
            </Link>
          )}
          <Link href="/aws" className="px-6 py-2 hover:bg-gray-100 font-extrabold">AWS</Link>
          <Link href="/ews" className="px-6 py-2 hover:bg-gray-100 font-extrabold">EWS</Link>
          <Link href="/scada" className="px-6 py-2 hover:bg-gray-100">SCADA</Link>
          <Link href="/reports" className="px-6 py-2 hover:bg-gray-100">Reports</Link>
          <Link href="/trends" className="px-6 py-2 hover:bg-gray-100">Trends</Link>
          <Link href="/configuration" className="px-6 py-2 hover:bg-gray-100">Configuration</Link>
          <Link href="/settings" className="px-6 py-2 hover:bg-gray-100">Settings</Link>
        </div>
      )}
    </nav>
  );
}
