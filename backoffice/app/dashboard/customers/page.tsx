import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function CustomersPage() {
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      document: "123.456.789-00",
      gender: "MALE",
      ranking: 4,
      orders: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      document: "987.654.321-00",
      gender: "FEMALE",
      ranking: 5,
      orders: 24,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      document: "456.789.123-00",
      gender: "MALE",
      ranking: 3,
      orders: 8,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      document: "789.123.456-00",
      gender: "FEMALE",
      ranking: 4,
      orders: 15,
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      document: "321.654.987-00",
      gender: "MALE",
      ranking: 2,
      orders: 5,
    },
  ]

  const renderRanking = (ranking: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`text-lg ${i < ranking ? "text-yellow-500" : "text-gray-300"}`}>
          ★
        </span>
      ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search by name, email, or document..." className="pl-10" />
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
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{customer.id}</td>
                  <td className="p-4 font-medium">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.document}</td>
                  <td className="p-4">{customer.gender}</td>
                  <td className="p-4">
                    <div className="flex">{renderRanking(customer.ranking)}</div>
                  </td>
                  <td className="p-4">{customer.orders}</td>
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
