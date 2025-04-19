import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
export function Header() {
  return (
    <header>
      <div className="container pt-11">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="brev.ly" />
          </Link>
        </div>
      </div>
    </header>
  )
} 