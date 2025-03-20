import { CarouselDemo } from '@/components/Hero/Carousel'
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity'

const Page = () => {
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