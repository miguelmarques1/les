"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { services } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await services.customerService.getAllUsers()
      setCustomers(data)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.document?.toLowerCase().includes(searchLower)
    )
  })

  const renderRanking = (ranking: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`text-lg ${i < ranking ? "text-yellow-500" : "text-gray-300"}`}>
          ★
        </span>
      ))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <p>Carregando clientes...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name, email, or document..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Document</th>
                <th className="text-left p-4 font-medium">Gender</th>
                <th className="text-left p-4 font-medium">Ranking</th>
                <th className="text-left p-4 font-medium">Orders</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{customer.id}</td>
                  <td className="p-4 font-medium">{customer.name || "N/A"}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.document || "N/A"}</td>
                  <td className="p-4">{customer.gender || "N/A"}</td>
                  <td className="p-4">
                    <div className="flex">{renderRanking(customer.ranking || 0)}</div>
                  </td>
                  <td className="p-4">{customer.orders || 0}</td>
                  <td className="p-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
