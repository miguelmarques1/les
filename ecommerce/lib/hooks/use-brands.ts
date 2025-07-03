"use client"

import { useState, useEffect } from "react"
import type { BrandModel } from "../models/brand-model"
import { brandService } from "../services"

export function useBrands() {
  const [brands, setBrands] = useState<BrandModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await brandService.getBrands()
        setBrands(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch brands:", err)
        setError("Falha ao carregar as bandeiras de cartão")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, isLoading, error }
}
