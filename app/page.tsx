import { CarouselDemo } from '@/components/Hero/Carousel'
import CategorySection from '@/components/Hero/CategorySection'
import FeaturedProducts from '@/components/Hero/FeaturedProducts'
import Information from '@/components/Hero/Information'
import { Reviews } from '@/components/Hero/Reviews'
import SeasonalProducts from '@/components/Hero/SeasonalProducts'
import StylishFontPage from '@/components/Hero/StylishFontPage'
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity'

const Page = () => {
  return (
    <div className='w-full max-w-[2400px]'>
      <CarouselDemo/>
      <VelocityScroll>Sleek Studio</VelocityScroll>
      <hr className='border-[2px] border-black mx-5' />
      <FeaturedProducts/>
      <Information/>
      <CategorySection/>
      <SeasonalProducts/>
      <StylishFontPage/>
      <Reviews/>
    </div>
  )
}
export default Page