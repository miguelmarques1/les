"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useCustomerProfile } from "@/lib/hooks/use-customer-profile"

interface DeactivateAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DeactivateAccountModal({ isOpen, onClose }: DeactivateAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {deleteProfile} = useCustomerProfile()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleDeactivate = async () => {
    // Validações
    if (confirmationText !== "DESATIVAR") {
      toast({
        title: "Confirmação incorreta",
        description: "Por favor, digite 'DESATIVAR' para confirmar.",
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Senha necessária",
        description: "Por favor, insira sua senha para confirmar.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 🔥 Chamada real para desativar conta usando deleteProfile
      await deleteProfile(password)

      toast({
        title: "Conta desativada",
        description: "Sua conta foi desativada com sucesso. Você tem 30 dias para reativá-la.",
      })

      // Logout do usuário
      logout()

      // Redirecionar para página inicial
      window.location.href = "/"
    } catch (error: any) {
      console.error("Error deactivating account:", error)

      toast({
        title: "Erro ao desativar conta",
        description:
          error?.message ||
          "Não foi possível desativar sua conta. Verifique sua senha e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleClose = () => {
    setConfirmationText("")
    setPassword("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Desativar Conta</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Esta ação desativará sua conta temporariamente. Você terá 30 dias para reativá-la antes que seus dados sejam
            permanentemente excluídos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">O que acontecerá:</h4>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>Você não poderá mais acessar sua conta</li>
              <li>Seus pedidos em andamento serão mantidos</li>
              <li>Você não receberá mais e-mails promocionais</li>
              <li>Seus dados serão mantidos por 30 dias para recuperação</li>
              <li>Após 30 dias, sua conta será permanentemente excluída</li>
            </ul>
          </div>

          <div>
            <Label htmlFor="confirmation" className="text-gray-700">
              Para confirmar, digite <span className="font-bold text-red-600">DESATIVAR</span> no campo abaixo:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
              placeholder="Digite DESATIVAR"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Digite sua senha para confirmar:
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="mt-2"
            />
          </div>

          <p className="text-xs text-gray-600">
            Ao desativar sua conta, você concorda que entende as consequências desta ação.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={isLoading || confirmationText !== "DESATIVAR" || !password}
          >
            {isLoading ? "Desativando..." : "Desativar Conta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}