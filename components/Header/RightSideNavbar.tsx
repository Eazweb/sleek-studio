import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import UserMenu from './UserMenu'
import SearchButton from './Search/Searchbutton'

export const RightSideNavbar = () => {
  return (
    <div className='flex items-center gap-4 md:gap-6'>
        <SearchButton/>
        <Link href='/cart'>
            <ShoppingCartIcon/>
        </Link>
        <Link href='/wishlist' className='hidden md:flex'>
            <HeartIcon/>
        </Link>
        <UserMenu/>
    </div>
  )
}

export default RightSideNavbar