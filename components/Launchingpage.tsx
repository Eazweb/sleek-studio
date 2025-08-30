import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Playfair_Display } from "next/font/google"
import { Instagram, MessageCircle } from "lucide-react"
import { whatsappNumber } from "@/config/config"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export default function LaunchingSoonPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/launch.webp")' }}
    >
      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center p-4">
        {/* Moved logo to top center as requested */}
        <div className="flex items-center gap-3 pt-8">
          <Image src="/logo.svg" alt="Sleek Studio Logo" width={60} height={60} className="w-12 h-12" />
        </div>

        {/* Removed email form and subtitle, kept only main headline in center */}
        <div className="flex flex-col items-center justify-center flex-1">
          <h1
            className={`${playfairDisplay.className} text-5xl md:text-7xl font-bold text-white text-center mb-6 leading-tight max-w-4xl`}
          >
            We will be back soon!
          </h1>
        </div>

        <div className="flex items-center gap-6 pb-8">
          <Button variant="ghost" size="lg" className="text-orange-400 rounded-full p-4 w-16 h-16" asChild>
            <a href="https://www.instagram.com/sleekstudioofficial/?hl=en" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-8 h-8" />
            </a>
          </Button>
          <Button variant="ghost" size="lg" className="text-green-400 rounded-full p-4 w-16 h-16" asChild>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-8 h-8" />
            </a>
          </Button>
          <Button variant="ghost" size="lg" className="text-orange-400 rounded-full p-4 w-16 h-16" asChild>
            <a href="https://www.instagram.com/sleekstudio.in/" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-8 h-8" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
