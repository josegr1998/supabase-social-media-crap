"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { loginWithGithub } from "@/actions/login";
import { signOut } from "@/actions/signOut";
import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

export const Navbar = ({ user }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-mono text-xl font-bold text-white">
            forum<span className="text-purple-500">.app</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Post
            </Link>
            <Link
              href="/communities"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Communities
            </Link>
            <Link
              href="/community/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Community
            </Link>
          </div>

          <div className="md:hidden">
            <button
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {" "}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
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

          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata.avatar_url && (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 px-3 py-1 rounded cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithGithub()}
                className="bg-blue-500 px-3 py-1 rounded cursor-pointer"
              >
                Sign in with Github
              </button>
            )}
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Home
                </Link>
                <Link
                  href="/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Create Post
                </Link>
                <Link
                  href="/communities"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Communities
                </Link>
                <Link
                  href="/community/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Create Community
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
