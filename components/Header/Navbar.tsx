import Image from 'next/image'
import React from 'react'
import { NavigationMenuDemo } from './NavigationMenuDemo'
import RightSideNavbar from './RightSideNavbar'
import SmallDisplayButton from './SmallDisplayButton'

export const Navbar = () => {
  return (
    <div className='w-full z-50 px-6 flex justify-between items-center py-5 md:py-0'>
        <Image src="https://www.vistaprint.com/hub/types-of-logos" width={100} height={100} alt="logo" className='hidden md:flex'/>
        <div className='flex md:hidden'>
            <SmallDisplayButton/>
        </div>
        <div className='hidden md:flex'>
            <NavigationMenuDemo/>
        </div>
        <RightSideNavbar/>
    </div>
  )
}

export default Navbar