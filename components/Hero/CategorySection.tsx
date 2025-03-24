import Image from "next/image"
import Link from "next/link"

// Category data
const categories = [
  {
    id: 1,
    title: "Knitwear",
    image: "/placeholder.svg?height=300&width=600",
    link: "/category/knitwear"
  },
  {
    id: 2,
    title: "Outerwear",
    image: "/placeholder.svg?height=300&width=600",
    link: "/category/outerwear"
  },
  {
    id: 3,
    title: "Accessories",
    image: "/placeholder.svg?height=300&width=600",
    link: "/category/accessories"
  },
]

export const CategorySection = () => {
  return (
    <div className="py-12 px-4 ">
      {/* Container for categories */}
      <div className="relative">
        {/* Horizontal scrolling container for mobile */}
        <div className="md:hidden relative w-full overflow-x-auto pb-6 -mx-4 px-4">
          <div className="flex gap-4 w-max">
            {categories.map((category) => (
              <CategoryBox key={category.id} category={category} className="min-w-[280px]" />
            ))}
          </div>
        </div>
        
        {/* Desktop layout with space-between */}
        <div className="hidden md:flex justify-between gap-8 px-10">
          {categories.map((category) => (
            <CategoryBox key={category.id} category={category} className="w-1/3" />
          ))}
        </div>
      </div>
    </div>
  )
}

// CategoryBox component
interface CategoryBoxProps {
  category: {
    id: number
    title: string
    image: string
    link: string
  }
  className?: string
}

const CategoryBox = ({ category, className = "" }: CategoryBoxProps) => {
  return (
    <Link 
      href={category.link}
      className={`block group transition-transform hover:-translate-y-1 ${className}`}
    >
      <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {/* Image container with 2:1 aspect ratio */}
        <div className="relative aspect-square">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Title overlay on image */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <h3 className="font-bold text-xl text-white">{category.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CategorySection