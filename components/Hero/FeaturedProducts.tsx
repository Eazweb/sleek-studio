import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"


export const FeaturedProducts=()=>{
    return(
        <div>

        </div>
    )
}

export const ProductCarousel=()=>{
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full py-6 max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-[5/4] items-center justify-center p-6">
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

export const ImageShow=()=>{
    return(
        <div>
            <Image src='' width={500} height={500} className="aspect-square" alt="" />
        </div>
    )
}

export default FeaturedProducts
