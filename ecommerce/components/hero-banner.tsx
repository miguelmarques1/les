import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <div className="relative bg-sky-200 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-md mb-4">
              Summer
              <br />
              <span className="text-6xl md:text-8xl">READING</span>
            </h1>
            <p className="text-white text-lg mb-6 max-w-md mx-auto md:mx-0">
              Descubra os melhores livros para aproveitar seu verão com histórias incríveis.
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/colecao/verao">CONFIRA</Link>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-80">
              {/* Book stack illustration */}
              <div className="absolute right-0 top-0 transform rotate-6">
                <div className="w-32 h-40 bg-amber-600 rounded-sm shadow-lg"></div>
              </div>
              <div className="absolute right-10 top-5 transform -rotate-3">
                <div className="w-32 h-40 bg-emerald-600 rounded-sm shadow-lg"></div>
              </div>
              <div className="absolute right-20 top-10 transform rotate-2">
                <div className="w-32 h-40 bg-sky-600 rounded-sm shadow-lg"></div>
              </div>
              <div className="absolute right-30 top-15 transform -rotate-5">
                <div className="w-32 h-40 bg-purple-600 rounded-sm shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative book shelf on the left */}
      <div className="absolute left-0 top-0 h-full w-12 bg-amber-100 hidden md:block">
        <div className="h-full flex flex-col justify-around">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-8 w-full bg-${["amber", "emerald", "sky", "purple"][i % 4]}-500`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}
