"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useUser, useAuthStore } from "@/lib/stores/auth-store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPositionsOpen, setIsPositionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const user = useUser();
  const logout = useAuthStore((state) => state.logout);

  const positions = [
    { number: 1, name: "Carry", href: "/positions/1" },
    { number: 2, name: "Mid", href: "/positions/2" },
    { number: 3, name: "Offlaner", href: "/positions/3" },
    { number: 4, name: "Support", href: "/positions/4" },
    { number: 5, name: "Hard Support", href: "/positions/5" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-white">DOTA</span>
              <span className="text-red-500">GPT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              href="/news"
              className="text-gray-300 hover:text-white transition-colors"
            >
              News
            </Link>

            {/* Positions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPositionsOpen(!isPositionsOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                suppressHydrationWarning={true}
              >
                <span>Positions</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isPositionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
                  >
                    {positions.map((position) => (
                      <Link
                        key={position.number}
                        href={position.href}
                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                        onClick={() => setIsPositionsOpen(false)}
                      >
                        <span className="text-red-500 font-semibold">
                          {position.number}.
                        </span>{" "}
                        {position.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/chat"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Chat
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-b-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
            suppressHydrationWarning={true}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800 py-4"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>

                {/* Mobile Positions */}
                <div>
                  <button
                    onClick={() => setIsPositionsOpen(!isPositionsOpen)}
                    className="flex items-center justify-between w-full text-gray-300 hover:text-white transition-colors"
                    suppressHydrationWarning={true}
                  >
                    <span>Positions</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isPositionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 ml-4 space-y-2"
                      >
                        {positions.map((position) => (
                          <Link
                            key={position.number}
                            href={position.href}
                            className="block text-gray-400 hover:text-white transition-colors"
                            onClick={() => {
                              setIsOpen(false);
                              setIsPositionsOpen(false);
                            }}
                          >
                            <span className="text-red-500 font-semibold">
                              {position.number}.
                            </span>{" "}
                            {position.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/news"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  News
                </Link>

                <Link
                  href="/chat"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Chat
                </Link>

                {/* Mobile Auth Section */}
                {user ? (
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm">
                      Signed in as{" "}
                      <span className="text-white">{user.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-fit"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
