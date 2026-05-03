"use client";

import React from 'react';
// import sensebg from '../images/sensebg.png';
import Link from 'next/link';
import { useProfile } from '../contextAPI/ProfileContext';
import NavDropdownMenu from './NavDropDown';

function Header() {
  const { user, logout } = useProfile();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

    return (
        <>
        <div className="m-0 w-full flex flex-col lg:flex-row items-center justify-center lg:justify-around bg-orange-600 px-0 py-5 pb-2 lg:pb-3 h-30 lg:h-30 sticky top-0 overflow-y-visible z-50">
            <div className="flex flex-row items-center justify-center lg:justify-start mt-2 lg:mt-0">
                <Link href="/" className="logo-image">
                    {/* Logo image would go here if available */}
                </Link>
                <Link href="/" className="w-fit ml-0">
                    <h2 className='text-white font-normal text-[20.8px]'>Website Directory</h2>
                </Link>
            </div>
            <div className='hidden lg:block text-white text-[17.6px] font-normal capitalize'>
                Role: {user?.role}
            </div>
            <div className="flex flex-row gap-0 items-center justify-center">
                <div className="text-white">
                {user?.role === "admin" && (
                    <h3 className='text-white text-[17.6px] font-normal'>{user.name}</h3>
                )}

                {user?.role === "viewer" && (
                    <>
                    <Link href="/app/profiledetails">
                        <h3 className='text-white text-[17.6px] font-normal'><i className="fa-regular fa-circle-user"></i> {user.name}</h3>
                    </Link>
                    </>
                )}
                </div>
                {user?.role === "admin" && (
                <div className='px-4'>
                    <NavDropdownMenu />
                </div>
                )}
                <div className="text-white my-0 mx-1.25">|</div>
                <button onClick={handleLogout} href="#" className="text-white bg-transparent border-none outline-none cursor-pointer">
                    <div><h3>Logout <i className='fa-solid fa-right-from-bracket text-white text-[17.6px] font-[400px]'></i></h3></div>
                </button>
            </div>
        </div>
        </>
    )
}

export default Header;