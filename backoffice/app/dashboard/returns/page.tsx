"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { services } from "@/services"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { ReturnExchangeRequestStatus } from "@/enums/return-exchange-request-status"

export default function ReturnsPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [returnRequests, setReturnRequests] = useState<any[]>([])
  const [filteredRequests, setFilteredRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchReturnRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [returnRequests, searchQuery, statusFilter, typeFilter])

  const fetchReturnRequests = async () => {
    try {
      setLoading(true)
      const data = await services.returnExchangeService.getAllRequests()
      setReturnRequests(data)
      setFilteredRequests(data)
    } catch (error) {
      console.error("Error fetching return requests:", error)
      toast({
        title: "Error",
        description: "Failed to load return/exchange requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = [...returnRequests]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.description?.toLowerCase().includes(query) ||
          request.customer_id?.toString().includes(query) ||
          request.id?.toString().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      const isExchange = typeFilter === "exchange"
      filtered = filtered.filter((request) => {
        const status = request.status || ""
        return isExchange ? status.includes("EXCHANGE") : status.includes("RETURN")
      })
    }

    setFilteredRequests(filtered)
  }

  const handleUpdateStatus = (request: any, status: string) => {
    setSelectedRequest(request)
    setNewStatus(status)
    setOpenDialog(true)
  }

  const confirmStatusUpdate = async () => {
    try {
      await services.returnExchangeService.updateStatus(selectedRequest.id, newStatus)

      // Update the local state
      const updatedRequests = returnRequests.map((request) => {
        if (request.id === selectedRequest.id) {
          return { ...request, status: newStatus }
        }
        return request
      })

      setReturnRequests(updatedRequests)

      toast({
        title: "Status Updated",
        description: `Request #${selectedRequest.id} status has been updated to ${formatStatus(newStatus)}`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      })
    } finally {
      setOpenDialog(false)
    }
  }

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    if (status.includes("REQUESTED")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (status.includes("ACCEPTED")) {
      return "bg-blue-100 text-blue-800"
    } else if (status.includes("REJECTED")) {
      return "bg-red-100 text-red-800"
    } else if (status.includes("COMPLETED")) {
      return "bg-green-100 text-green-800"
    }

    return "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type: string) => {
    return type === "return" ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-indigo-800"
  }

  const formatStatus = (status: string) => {
    if (!status) return ""

    // Replace underscores with spaces and convert to title case
    return status
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  // Determine available status options based on request type and current status
  const getAvailableStatusOptions = (request: any) => {
    const currentStatus = request?.status || ""
    const isExchange = currentStatus.includes("EXCHANGE") || request?.type === "exchange"

    if (isExchange) {
      return [
        ReturnExchangeRequestStatus.EXCHANGE_REQUESTED,
        ReturnExchangeRequestStatus.EXCHANGE_ACCEPTED,
        ReturnExchangeRequestStatus.EXCHANGE_REJECTED,
        ReturnExchangeRequestStatus.EXCHANGE_COMPLETED,
      ]
    } else {
      return [
        ReturnExchangeRequestStatus.RETURN_REQUESTED,
        ReturnExchangeRequestStatus.RETURN_REJECTED,
        ReturnExchangeRequestStatus.RETURN_COMPLETED,
      ]
    }
  }

  // Determine request type from status
  const getRequestTypeFromStatus = (status: string) => {
    if (!status) return ""
    return status.includes("EXCHANGE") ? "exchange" : "return"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Returns & Exchanges</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by description or ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all" value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="return">Returns</SelectItem>
            <SelectItem value="exchange">Exchanges</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.EXCHANGE_REQUESTED}>Exchange Requested</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.EXCHANGE_ACCEPTED}>Exchange Accepted</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.EXCHANGE_REJECTED}>Exchange Rejected</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.EXCHANGE_COMPLETED}>Exchange Completed</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.RETURN_REQUESTED}>Return Requested</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.RETURN_REJECTED}>Return Rejected</SelectItem>
            <SelectItem value={ReturnExchangeRequestStatus.RETURN_COMPLETED}>Return Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Customer ID</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-muted-foreground">
                      No return or exchange requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const requestType = request.type || getRequestTypeFromStatus(request.status)
                    return (
                      <tr key={request.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">#{request.id}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(requestType)}`}>
                            {requestType === "exchange" ? "Exchange" : "Return"}
                          </span>
                        </td>
                        <td className="p-4">{request.customer_id}</td>
                        <td className="p-4">{request.description}</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">{request.items?.length || 0} items</div>
                        </td>
                        <td className="p-4">{formatDate(request.createdAt)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                            {formatStatus(request.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Select
                            defaultValue="select"
                            onValueChange={(value) => {
                              if (value !== "select") {
                                handleUpdateStatus(request, value)
                              }
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Atualizar Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="select" disabled>
                                Atualizar Status
                              </SelectItem>
                              {getAvailableStatusOptions(request).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {formatStatus(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the status of request #{selectedRequest?.id} to {formatStatus(newStatus)}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Status</p>
              <Badge variant="outline" className={getStatusColor(selectedRequest?.status || "")}>
                {formatStatus(selectedRequest?.status || "")}
              </Badge>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium">New Status</p>
              <Badge variant="outline" className={getStatusColor(newStatus)}>
                {formatStatus(newStatus)}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
