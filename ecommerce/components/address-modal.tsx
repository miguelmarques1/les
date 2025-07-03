"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddressForm from "./address-form"
import type { AddressModel } from "@/lib/models/address-model"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editAddress?: AddressModel
  title?: string
}

export default function AddressModal({ isOpen, onClose, onSuccess, editAddress, title }: AddressModalProps) {
  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title || (editAddress ? "Editar Endereço" : "Adicionar Endereço")}</DialogTitle>
        </DialogHeader>
        <AddressForm onCancel={onClose} onSuccess={handleSuccess} editAddress={editAddress} />
      </DialogContent>
    </Dialog>
  )
}
