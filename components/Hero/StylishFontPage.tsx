"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { stylishFont } from "@/app/fonts"

// Instagram-style post data
const posts = [
  {
    id: 1,
    username: "anamariaburs",
    image: "/placeholder.svg?height=600&width=600",
    description: "Megan Sheep Jumper",
    postLink: "/products/megan-sheep-jumper",
  },
  {
    id: 2,
    username: "sophiestyles",
    image: "/placeholder.svg?height=600&width=600",
    description: "Alpine Wool Cardigan",
    postLink: "/products/alpine-wool-cardigan",
  },
  {
    id: 3,
    username: "fashionforward",
    image: "/placeholder.svg?height=600&width=600",
    description: "Nordic Pattern Sweater",
    postLink: "/products/nordic-pattern-sweater",
  },
  {
    id: 4,
    username: "winterwardrobe",
    image: "/placeholder.svg?height=600&width=600",
    description: "Merino Blend Pullover",
    postLink: "/products/merino-blend-pullover",
  },
]

export default function StylishFontPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentPost = posts[currentIndex]

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length)
  }

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 5000)
    
    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full  mx-auto py-12 px-4 overflow-hidden">

      <div className="relative">
        {/* Red text that sits BEHIND the carousel */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <h1 className={` ${stylishFont.className} text-6xl md:text-8xl xl:text-[10rem] font-bold text-red-600`}>Sleek Studio</h1>
        </div>

        {/* Main carousel container - positioned BETWEEN the two text layers */}
        <div
          className="relative z-10 w-[60%] max-w-[400px]  mx-auto rounded-lg overflow-hidden aspect-square bg-gray-100"
          
        >
          <Image
            src={currentPost.image || "/placeholder.svg"}
            alt={currentPost.description}
            fill
            className="object-cover"
            priority
          />

          {/* Username tag */}
          <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm">
            @{currentPost.username}
          </div>
          
          {/* Navigation buttons - positioned at the bottom right of carousel */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-30">
            <button
              onClick={goToPrevious}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={goToNext}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Lighter text overlay ON TOP of the carousel */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1 className={`${stylishFont.className} text-6xl md:text-8xl xl:text-[10rem] font-bold text-red-600/20`}>Sleek Studio</h1>
        </div>
      </div>

      {/* Caption below carousel */}
      <div className="text-center mt-4">
        <p className="text-base">
          {currentPost.username} styling the{" "}
          <Link href={currentPost.postLink} className="text-amber-800 hover:underline">
            {currentPost.description}
          </Link>
        </p>
      </div>
    </div>
  )
}

