import { CarouselDemo } from '@/components/Hero/Carousel'
import CategorySection from '@/components/Hero/CategorySection'
import Information from '@/components/Hero/Information'
import { Reviews } from '@/components/Hero/Reviews'
import StylishFontPage from '@/components/Hero/StylishFontPage'
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity'

const Page = () => {
  return (
    <div className='w-full max-w-[2400px]'>
       <CarouselDemo/>
      <VelocityScroll>Sleek Studio</VelocityScroll>
      <CategorySection/>
      <Information/>
      <StylishFontPage/>
      <Reviews/>
    </div>
  )
}
export default Page