"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow">
      {/* Wrapper */}
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 items-center">
          {/* Left: Logo */}
          <Link
            href="/"
            className="text-lg md:text-xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
          >
            BinaryStories
          </Link>

          {/* Center: SearchBar */}
          <div className="flex justify-center">
            <div className="w-96">
              {" "}
              <SearchBar />
            </div>
          </div>

          {/* Right: Menu + Auth */}
          <div className="flex items-center justify-end space-x-6 text-sm md:text-base">
            <ul className="flex items-center space-x-6 text-gray-700 font-medium">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                <Link href="/articles">Articles</Link>
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
            {/* <div className="flex items-center space-x-3">
              <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Login
              </button>
              <button className="text-gray-700 hover:text-gray-900 px-4 py-1 font-medium transition-colors">
                Sign Up
              </button>
            </div> */}
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden items-center gap-4">
          {/* Logo */}
          <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
            <Link href="/">BinaryStories</Link>
          </div>

          {/* SearchBar */}
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Menu + Auth */}
          <div className="flex items-center gap-3 text-sm whitespace-nowrap">
            <ul className="flex items-center gap-3 text-gray-700 font-medium">
              <li className="hover:text-gray-900 cursor-pointer">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:text-gray-900 cursor-pointer">
                <Link href="/articles">Articles</Link>
              </li>
              <li className="hover:text-gray-900 cursor-pointer">
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
            {/* <button className="text-gray-700 hover:text-gray-900 font-medium">
              Login
            </button>
            <button className="text-gray-700 hover:text-gray-900 font-medium">
              Sign Up
            </button> */}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex items-center justify-between md:hidden">
          {/* Left: Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-gray-900 hover:opacity-80 transition-opacity"
          >
            BinaryStories
          </Link>
          {/* Right: Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white z-50 shadow-lg">
          <div className="px-6 py-6 space-y-2">
            {/* Search Bar at Top */}
            <div className="pb-4">
              <SearchBar />
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <div className="block py-2 text-gray-700 hover:text-gray-900 font-medium text-sm cursor-pointer">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
              </div>
              <div className="block py-2 text-gray-700 hover:text-gray-900 font-medium text-sm cursor-pointer">
                <Link
                  href="/articles"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Articles
                </Link>
              </div>
              <div className="block py-2 text-gray-700 hover:text-gray-900 font-medium text-sm cursor-pointer">
                <Link
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              {/* <button className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium text-sm">
                Login
              </button>
              <button className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium text-sm">
                Sign Up
              </button> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
