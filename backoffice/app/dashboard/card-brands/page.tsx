"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus, Search, Upload } from "lucide-react"

export default function CardBrandsPage() {
  const [openDialog, setOpenDialog] = useState(false)

  const brands = [
    { id: 1, name: "Visa", imageUrl: "/placeholder.svg?height=40&width=60" },
    { id: 2, name: "Mastercard", imageUrl: "/placeholder.svg?height=40&width=60" },
    { id: 3, name: "American Express", imageUrl: "/placeholder.svg?height=40&width=60" },
    { id: 4, name: "Discover", imageUrl: "/placeholder.svg?height=40&width=60" },
    { id: 5, name: "Diners Club", imageUrl: "/placeholder.svg?height=40&width=60" },
  ]

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock API call
    console.log("Creating new card brand...")
    setOpenDialog(false)
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
        <Input placeholder="Search brands..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                    <img
                      src={brand.imageUrl || "/placeholder.svg"}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {brand.id}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
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
                <Input id="name" placeholder="e.g. Visa" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Brand Logo</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <Input id="image" type="file" className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    Select File
                  </Button>
                </div>
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
