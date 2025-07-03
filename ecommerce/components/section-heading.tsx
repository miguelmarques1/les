import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionHeadingProps {
  title: string
  viewAllLink?: string
  poweredBy?: string
}

export default function SectionHeading({ title, viewAllLink, poweredBy }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-amber-800">{title}</h2>
        {poweredBy && (
          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Powered by {poweredBy}</span>
        )}
      </div>

      {viewAllLink && (
        <Link href={viewAllLink} className="text-sm text-amber-600 hover:text-amber-800 flex items-center">
          Ver todos <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  )
}
