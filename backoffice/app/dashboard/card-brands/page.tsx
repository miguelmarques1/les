"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Trash2 } from "lucide-react"
import { services } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function CardBrandsPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const data = await services.brandService.getBrands()
      setBrands(data)
    } catch (error) {
      console.error("Failed to fetch brands:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as marcas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get("name") as string

    try {
      await services.brandService.createBrand(name)

      toast({
        title: "Sucesso",
        description: "Marca criada com sucesso!",
      })

      setOpenDialog(false)
      fetchBrands()
    } catch (error) {
      console.error("Failed to create brand:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a marca.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBrand = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta marca?")) {
      return
    }

    try {
      await services.brandService.deleteBrand(id)

      toast({
        title: "Sucesso",
        description: "Marca deletada com sucesso!",
      })

      fetchBrands()
    } catch (error) {
      console.error("Failed to delete brand:", error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar a marca.",
        variant: "destructive",
      })
    }
  }

  const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Card Brands</h1>
        </div>
        <p>Carregando marcas...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Card Brands</h1>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search brands..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {brand.id}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDeleteBrand(brand.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Card Brand</DialogTitle>
            <DialogDescription>Add a new card brand to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBrand}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input id="name" name="name" placeholder="e.g. Visa" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Brand</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
