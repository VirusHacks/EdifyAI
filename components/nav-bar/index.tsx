"use client"
import React, { useState } from "react";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const NavLink = ({ href, children }) => (
  <Link 
    prefetch={true}
    href={href}
    className="hover:scale-105 hover:duration-300 hover:transition-all px-4 py-2 mt-2 text-lg font-semibold text-gray-900 rounded-lg md:mt-0 hover:text-gray-900 focus:text-gray-900 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer"
  >
    {children}
  </Link>
);

const MenuButton = ({ menuOpen, onClick }) => (
  <button
    className="md:hidden rounded-lg focus:outline-none focus:shadow-outline"
    onClick={onClick}
  >
    <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
      {menuOpen ? (
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      )}
    </svg>
  </button>
);

const DropdownMenu = ({ isOpen, children }) => (
  isOpen && (
    <div className="absolute right-0 w-full mt-4 origin-top-right rounded-md shadow-lg md:w-96 z-50">
      <div className="px-2 py-2 bg-white rounded-xl shadow">
        {children}
      </div>
    </div>
  )
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useKindeBrowserClient();

  const navLinks = [
    { href: "/course-dashboard", text: "AI Course" },
    { href: "/dashboard", text: "AI Resume" },
    { href: "/mock/dashboard", text: "AI Mock Interview" },
    { href: "/meeting-home", text: "Meeting" },
    { href: "https://framevr.io/edifyai", text: "AR Learning" },
    { href: "/path", text: "Learning Path" },
    { href: "/tutor", text: "AI Tutor" },
    { href: "/pricing", text: "Pricing" },
  ];

  const dropdownItems = [
    { href: "/events", text: "Latest Hackathons" },
    { href: "/events", text: "Latest Meetups" },
    { href: "/internship", text: "Latest Internships" },
  ];

  return (
    <main className="w-full text-gray-700 bg-white z-50">
      <div className="flex flex-col max-w-[90%] px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="p-4 flex flex-row justify-between items-center h-[70px]">
          <NavLink href="/"><p className="text-2xl font-bold tracking-wider">Edify AI</p></NavLink>
          <MenuButton menuOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>

        <nav className={`${
          menuOpen ? "flex h-screen z-50 bg-white gap-8" : "hidden"
        } flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row`}>
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.text}
            </NavLink>
          ))}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:scale-105 hover:duration-300 hover:transition-all flex flex-row items-center w-full px-4 py-2 mt-2 text-lg font-semibold text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer"
            >
              <span>Upcoming Events</span>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className={`inline w-4 h-4 ml-1 transition-transform duration-200 transform ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <DropdownMenu isOpen={dropdownOpen}>
              {dropdownItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  <Link prefetch={true} href={item.href}>
                    <p className="block px-4 py-4 text-lg hover:scale-105 hover:duration-300 hover:transition-all font-semibold bg-transparent rounded-lg dark:bg-transparent md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                      {item.text}
                    </p>
                  </Link>
                  {index < dropdownItems.length - 1 && (
                    <div className="bg-gray-800 h-[0.5px]" />
                  )}
                </React.Fragment>
              ))}
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <img
                  src={user?.picture || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-lg font-semibold text-gray-900">
                  {user?.given_name || "User"}
                </span>
              </div>
            ) : (
              <>
                <LoginLink>
                  <Button className="font-semibold text-md">Sign In</Button>
                </LoginLink>
                <RegisterLink>
                  <Button className="font-semibold text-md">Get Started</Button>
                </RegisterLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </main>
  );
};

export default Navbar;