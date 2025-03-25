import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export const FeaturedProducts=()=>{
  return (
   <div className="w-[90%] mx-auto mt-6 md:mt-10">
   <h1 className="text-4xl md:text-6xl">Our BestSellers</h1>
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full py-6 "
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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
      <CarouselPrevious className="left-0" />
      <CarouselNext />
    </Carousel>
   </div>
  )
}

export default FeaturedProducts
