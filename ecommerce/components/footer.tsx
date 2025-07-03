import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-amber-800 mb-4">Livraria XYZ</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sua livraria online com os melhores títulos nacionais e internacionais.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-amber-700 hover:text-amber-900">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-amber-700 hover:text-amber-900">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-amber-700 hover:text-amber-900">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-amber-800 mb-4">Categorias</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Literatura
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Ficção
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Não-Ficção
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Infantil
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Negócios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-amber-800 mb-4">Informações</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Formas de Pagamento
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Entregas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-amber-800 mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-amber-700">
                  Acompanhar Pedido
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Livraria XYZ. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
