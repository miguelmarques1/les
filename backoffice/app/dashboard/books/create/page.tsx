"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { services } from "@/services"
import { toast } from "@/components/ui/use-toast"
import type { CategoryModel } from "@/models/category-model"
import type { PrecificationGroup } from "@/models/precification-group"

export default function CreateBookPage() {
  const router = useRouter()
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [selectedPrecificationGroupId, setSelectedPrecificationGroupId] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [precificationGroups, setPrecificationGroups] = useState<PrecificationGroup[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        const [categoriesData, precificationGroupsData] = await Promise.all([
          services.categoryService.getAll(),
          services.precificationGroupService.getAll(),
        ])
        setCategories(categoriesData)
        setPrecificationGroups(precificationGroupsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Erro",
          description: "Falha ao carregar categorias e grupos de precificação",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleCategoryChange = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId))
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)

    const isbnValue = formData.get("isbn") as string
    const isbnWithPrefix = isbnValue.startsWith("ISBN ") ? isbnValue : `ISBN ${isbnValue}`

    const bookData = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      year: formData.get("year") as string,
      publisher: formData.get("publisher") as string,
      edition: formData.get("edition") as string,
      isbn: isbnWithPrefix,
      pages: Number(formData.get("pages")),
      synopsis: formData.get("synopsis") as string,
      height: Number(formData.get("height")),
      width: Number(formData.get("width")),
      weight: Number(formData.get("weight")),
      depth: Number(formData.get("depth")),
      category_ids: selectedCategoryIds,
      precification_group_id: Number(selectedPrecificationGroupId),
    }

    try {
      await services.bookService.createBook(bookData)
      toast({
        title: "Sucesso",
        description: "Livro criado com sucesso!",
      })
      router.push("/dashboard/books")
    } catch (error) {
      console.error("Error creating book:", error)
      toast({
        title: "Erro",
        description: "Falha ao criar o livro",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingData) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/books">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Criar Novo Livro</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Livro</CardTitle>
              <CardDescription>Insira os detalhes básicos do livro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" placeholder="Digite o título do livro" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input id="author" name="author" placeholder="Digite o nome do autor" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Editora</Label>
                <Input id="publisher" name="publisher" placeholder="Digite o nome da editora" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input id="year" name="year" type="number" placeholder="Ano de publicação" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edition">Edição</Label>
                  <Input id="edition" name="edition" type="number" placeholder="Número da edição" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Páginas</Label>
                  <Input id="pages" name="pages" type="number" placeholder="Número de páginas" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                      ISBN
                    </span>
                    <Input id="isbn" name="isbn" placeholder="978-0132350884" className="rounded-l-none" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis">Sinopse</Label>
                <Textarea id="synopsis" name="synopsis" placeholder="Digite a sinopse do livro" rows={4} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias e Precificação</CardTitle>
              <CardDescription>Selecione as categorias e defina o grupo de precificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categorias</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategoryIds.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="font-normal">
                        {category.name.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precification-group">Grupo de Precificação</Label>
                <Select value={selectedPrecificationGroupId} onValueChange={setSelectedPrecificationGroupId} required>
                  <SelectTrigger id="precification-group">
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {precificationGroups.map((group) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name} ({group.profitPercentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {precificationGroups.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum grupo de precificação encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dimensões</CardTitle>
              <CardDescription>Insira as dimensões físicas do livro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Largura (cm)</Label>
                  <Input id="width" name="width" type="number" step="0.1" placeholder="Largura" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input id="height" name="height" type="number" step="0.1" placeholder="Altura" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Profundidade (cm)</Label>
                  <Input id="depth" name="depth" type="number" step="0.1" placeholder="Profundidade" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.01" placeholder="Peso" required />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Livro
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
