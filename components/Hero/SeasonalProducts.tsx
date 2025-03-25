import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"


export function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-[90%] mx-auto "
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/1">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}


const ImageArea=()=>{
    return(
        <Image src='logo.svg' width={500} height={500} className="aspect-square hidden md:flex" alt="" />
    )
}

export const SeasonalProducts=()=>{
    return (
        <div className="w-full flex max-h-[80vh] py-5 md:py-8 overflow-hidden justify-between items-center">
            <div className="w-[40%]">
                <ImageArea/>
            </div>
            <div className="w-full md:w-[60%] flex justify-center items-center">
            <CarouselSize/>
            </div>
        </div>
    )
}


export default SeasonalProducts