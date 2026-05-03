"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AppWindow, ChevronDownIcon, Group, FolderPlus, Globe, ListPlus, Dock, User, Users, UserPlus, LogOut } from 'lucide-react';
import { useProfile } from '../contextAPI/ProfileContext';

const NavDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useProfile();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="relative px-4" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 border border-solid border-white text-white px-4 py-1 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
      >
        Menu <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 lg:left-7.5 right-0 lg:right-7 mt-2 w-56 bg-gray-700 border border-gray-200 rounded-lg shadow-lg animate-fadeIn z-50 px-4" style={{padding: "0 3px"}}>
          <ul className="flex flex-col gap-2 py-2" style={{padding: "5px 0"}}>
            <li>
              <Link href="/app/home" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <AppWindow className='w-4 h-4' /> Website Directory
              </Link>
            </li>
            <li>
              <Link href="/app/tenantcategorylists" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <Group className="w-4 h-4" /> Website Categories
              </Link>
            </li>
            <li>
              <Link href="/app/addtenantcategory" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <FolderPlus className="w-4 h-4" /> Add a Website Category
              </Link>
            </li>
            <li>
              <Link href="/app/tenantLists" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <Globe className="w-4 h-4" /> Website Types
              </Link>
            </li>
            <li>
              <Link href="/app/addtenant" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <ListPlus className="w-4 h-4" /> Add Website Type
              </Link>
            </li>
            <li>
              <Link href="/app/tenantapps" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <Dock className="w-4 h-4" /> All Apps
              </Link>
            </li>
            <li>
              <Link href="/app/addtenantapp" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <FolderPlus className="w-4 h-4" /> Create Apps
              </Link>
            </li>
            <li>
              <Link href="/app/profiledetails" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <User className="w-4 h-4" /> Profile Details
              </Link>
            </li>
            <li>
              <Link href="/app/manageusers" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <Users className="w-4 h-4" /> Manage Users
              </Link>
            </li>
            <li>
              <Link href="/app/addnewuser" className="flex justify-start items-center gap-1 px-4 py-2 text-white hover:bg-red-600" style={{padding: "0 5px"}}>
                <UserPlus className="w-4 h-4" /> Add a New User
              </Link>
            </li>
            <li>
              <div onClick={handleLogout} className="flex justify-start items-center gap-1 px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer" style={{padding: "0 5px"}}>
                <LogOut className="w-4 h-4" /> Logout
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavDropdownMenu;
