import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">brev.ly</span>
          </Link>
          
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
} 