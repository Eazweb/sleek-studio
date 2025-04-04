'use client'
import React, { useState, useEffect } from 'react';
import SmallDisplayButton from './MobileMenu/SmallDisplayButton';
import RightSideNavbar from './RightSideNavbar';
import { NavigationMenuDemo } from './NavigationMenuDemo';
import { usePathname } from "next/navigation";


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarClasses = scrolled ? 'navbar-scrolled' : 'navbar-initial';

  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  
  

  return (
    <div className={`w-full z-30 px-3 md:px-6 flex sticky top-0 justify-between items-center py-5 ${navbarClasses}`}>
      <h1 className='text-4xl hidden md:flex'>Sleek Studio</h1>
      <div className='flex md:hidden'>
        <SmallDisplayButton />
      </div>
      <div className='hidden md:flex'>
        <NavigationMenuDemo />
      </div>
      <RightSideNavbar />
    </div>
  );
};

export default Navbar;
