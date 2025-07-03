import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import Link from "next/link"

export default function StockPage() {
  const stockItems = [
    {
      id: 101,
      bookId: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      supplier: "BookWholesale Inc.",
      entryDate: "2023-01-15",
      saleDate: null,
      costsValue: 8.99,
      unitPrice: 14.99,
      status: "In Stock",
    },
    {
      id: 102,
      bookId: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      supplier: "BookWholesale Inc.",
      entryDate: "2023-01-15",
      saleDate: "2023-02-20",
      costsValue: 8.99,
      unitPrice: 14.99,
      status: "Sold",
    },
    {
      id: 103,
      bookId: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      supplier: "LiterarySupplies Co.",
      entryDate: "2023-01-20",
      saleDate: null,
      costsValue: 7.5,
      unitPrice: 12.99,
      status: "In Stock",
    },
    {
      id: 104,
      bookId: 3,
      title: "1984",
      author: "George Orwell",
      supplier: "ClassicBooks Ltd.",
      entryDate: "2023-02-05",
      saleDate: null,
      costsValue: 6.99,
      unitPrice: 11.99,
      status: "In Stock",
    },
    {
      id: 105,
      bookId: 4,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      supplier: "FantasyReads Distributors",
      entryDate: "2023-02-10",
      saleDate: "2023-03-15",
      costsValue: 9.5,
      unitPrice: 15.99,
      status: "Sold",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <Link href="/dashboard/books">
          <Button>Adicionar em Estoque from Books</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search by title, author, or supplier..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Book</th>
                <th className="text-left p-4 font-medium">Supplier</th>
                <th className="text-left p-4 font-medium">Entry Date</th>
                <th className="text-left p-4 font-medium">Sale Date</th>
                <th className="text-left p-4 font-medium">Cost</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.author}</div>
                    </div>
                  </td>
                  <td className="p-4">{item.supplier}</td>
                  <td className="p-4">{item.entryDate}</td>
                  <td className="p-4">{item.saleDate || "-"}</td>
                  <td className="p-4">${item.costsValue.toFixed(2)}</td>
                  <td className="p-4">${item.unitPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
