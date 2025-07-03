"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/enums/category"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreateBookPage() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  const handleCategoryChange = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock API call
    console.log("Creating new book...")
    // Redirect to books page
    router.push("/dashboard/books")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/books">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Book</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
              <CardDescription>Enter the basic details of the book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter book title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" placeholder="Enter author name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input id="publisher" placeholder="Enter publisher name" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="Publication year" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input id="edition" type="number" placeholder="Edition number" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input id="pages" type="number" placeholder="Number of pages" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="ISBN number" required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories & Pricing</CardTitle>
              <CardDescription>Select categories and set pricing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.values(Category).map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category as Category)}
                      />
                      <Label htmlFor={category} className="font-normal">
                        {category.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="Book price" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precification-group">Precification Group</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="precification-group">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (30%)</SelectItem>
                    <SelectItem value="premium">Premium (40%)</SelectItem>
                    <SelectItem value="economy">Economy (20%)</SelectItem>
                    <SelectItem value="sale">Sale (15%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="status" defaultChecked />
                  <Label htmlFor="status" className="font-normal">
                    Active
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dimensions</CardTitle>
              <CardDescription>Enter the physical dimensions of the book</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input id="width" type="number" step="0.1" placeholder="Width" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" step="0.1" placeholder="Height" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Depth (cm)</Label>
                  <Input id="depth" type="number" step="0.1" placeholder="Depth" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input id="weight" type="number" step="1" placeholder="Weight" required />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Create Book
          </Button>
        </div>
      </form>
    </div>
  )
}
