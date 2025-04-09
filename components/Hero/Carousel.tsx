'use client'
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel 
      className="w-full mx-auto " 
      aspectRatio="responsive" 
      loop={true}
      autoPlay={true}
      autoPlayInterval={5000}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="rounded-none">
                <CardContent className="p-0">
                  <div className="w-full h-full aspect-[3/5] sm:aspect-[3/1] flex items-center justify-center">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant="ghost" />
      <CarouselNext variant="ghost" />
    </Carousel>
  )
}