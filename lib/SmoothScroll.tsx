'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll({ children }:{children:any}) {
  useEffect(() => {
    const lenis = new Lenis()
    
    function raf(time:any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
    
    return () => {
      lenis.destroy()
    }
  }, [])
  
  return children
}