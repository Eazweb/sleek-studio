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
      className="w-[90%] mx-auto flex justify-center items-center "
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
        <Image src='logo.svg' width={500} height={500} className="aspect-square " alt="" />
    )
}

export const SeasonalProducts=()=>{
    return (
        <div className="w-full flex py-5 md:py-8 overflow-hidden  items-center">
            <div className="w-[45%] hidden md:flex border-[1px] borderl-black aspect-square">
                <ImageArea/>
            </div>
            <div className="mx-auto">
                <CarouselSize/>
            </div>
        </div>
    )
}


export default SeasonalProducts