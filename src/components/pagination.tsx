"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages?:number
  
  onPageChange: (page: number) => void
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const [pages, setPages] = useState<number[]>([])

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    let pagesToShow: number[] = []

    if (totalPages <= 5) {
      pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      if (currentPage <= 3) {
        pagesToShow = [1, 2, 3]
      } else if (currentPage >= totalPages - 2) {
        pagesToShow = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      } else {
        pagesToShow = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
      }
    }

    setPages(pagesToShow)
  }, [totalItems, itemsPerPage, currentPage])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className="flex items-center justify-between ">
      <p className="text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
      </p>
      <div className="flex items-center">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded-none px-1">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            variant="outline"
            size="sm"
            className={`${currentPage === page ? "pagination-active" : ""} rounded-none border-l-none border-r-[1px]`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="rounded-none px-1"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}

