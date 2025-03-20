import { CarouselDemo } from '@/components/Hero/Carousel'
import Navbar from '@/components/Header/Navbar'
import React from 'react'
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity'

export const Page = () => {
  return (
    <div className='w-full max-w-[2400px]'>
      <div className='pb-8'>
       <CarouselDemo/>
      </div>
      <VelocityScroll>Sleek Studio</VelocityScroll>
    </div>
  )
}
export default Page