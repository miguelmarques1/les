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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Search } from "lucide-react"
import { CouponType } from "@/enums/coupon-type"
import { services } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function CouponsPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [couponType, setCouponType] = useState<CouponType>(CouponType.PERCENTAGE)
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const data = await services.couponService.getCoupons()
      setCoupons(data)
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cupons.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    try {
      await services.couponService.createCoupon({
        code: formData.get("code") as string,
        discount: Number(formData.get("discount")),
        type: couponType,
        status: formData.get("active") === "on" ? "AVAILABLE" : "DISABLED",
        expiryDate: formData.get("expiry_date") as string,
      })

      toast({
        title: "Sucesso",
        description: "Cupom criado com sucesso!",
      })

      setOpenDialog(false)
      fetchCoupons()
    } catch (error) {
      console.error("Failed to create coupon:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o cupom.",
        variant: "destructive",
      })
    }
  }

  const toggleCouponStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "AVAILABLE" ? "DISABLED" : "AVAILABLE"
      await services.couponService.toggleStatus(id, newStatus)

      toast({
        title: "Sucesso",
        description: "Status do cupom atualizado!",
      })

      fetchCoupons()
    } catch (error) {
      console.error("Failed to update coupon status:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do cupom.",
        variant: "destructive",
      })
    }
  }

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || coupon.type === typeFilter.toUpperCase()
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && coupon.status === "AVAILABLE") ||
      (statusFilter === "inactive" && coupon.status !== "AVAILABLE")

    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Coupons</h1>
        </div>
        <p>Carregando cupons...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by coupon code..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="value">Fixed Value</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Discount</th>
                <th className="text-left p-4 font-medium">Expiry Date</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{coupon.id}</td>
                  <td className="p-4 font-medium">{coupon.code}</td>
                  <td className="p-4">{coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed Value"}</td>
                  <td className="p-4">
                    {coupon.type === "PERCENTAGE" ? `${coupon.discount}%` : `R$ ${coupon.discount.toFixed(2)}`}
                  </td>
                  <td className="p-4">{coupon.expiryDate}</td>
                  <td className="p-4">
                    <Switch
                      checked={coupon.status === "AVAILABLE"}
                      onCheckedChange={() => toggleCouponStatus(coupon.id, coupon.status)}
                    />
                  </td>
                  <td className="p-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
            <DialogDescription>Add a new coupon code for customer discounts</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCoupon}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input id="code" name="code" placeholder="e.g. SUMMER20" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Coupon Type</Label>
                <Select
                  defaultValue={CouponType.PERCENTAGE}
                  onValueChange={(value) => setCouponType(value as CouponType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CouponType.PERCENTAGE}>Percentage</SelectItem>
                    <SelectItem value={CouponType.VALUE}>Fixed Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">
                  {couponType === CouponType.PERCENTAGE ? "Discount Percentage (%)" : "Discount Amount (R$)"}
                </Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  step={couponType === CouponType.PERCENTAGE ? "1" : "0.01"}
                  min="0"
                  max={couponType === CouponType.PERCENTAGE ? "100" : undefined}
                  placeholder={couponType === CouponType.PERCENTAGE ? "e.g. 20" : "e.g. 10.00"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input id="expiry_date" name="expiry_date" type="date" required />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" name="active" defaultChecked />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Coupon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
