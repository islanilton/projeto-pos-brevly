import { Link } from 'react-router-dom'
import notFoundImage from '../assets/images/404.svg'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
        <img 
          src={notFoundImage} 
          alt="404" 
          className="mx-auto mb-6"
          style={{ width: '404px', maxWidth: '100%', height: 'auto' }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Link não encontrado
        </h1>
        <p className="text-gray-600">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em{' '}
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            brev.ly
          </Link>
          .
        </p>
      </div>
    </div>
  )
} 