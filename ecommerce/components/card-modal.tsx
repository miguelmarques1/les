"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CardForm from "./card-form"

interface CardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
}

export default function CardModal({ isOpen, onClose, onSuccess, title }: CardModalProps) {
  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title || "Adicionar Cartão"}</DialogTitle>
        </DialogHeader>
        <CardForm onCancel={onClose} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
