import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          Página não encontrada
        </p>
        <Link
          to="/"
          className="text-primary-600 hover:text-primary-700"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
} 