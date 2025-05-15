import type React from "react"
import { Link } from "react-router-dom"

const NavBar: React.FC = () => {
  return (
    <nav className="navbar-dark flex items-center justify-between py-2 px-5 w-full box-border">
      {/* Logo section */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden"><img src="public/logo.webp" alt="ElBuenSabor" /></div>
        <span className="text-white font-bangers text-2xl italic">LOGO</span>
      </div>

      {/* Navigation links - centered */}
      <div className="flex justify-center gap-8">
        <Link to="/como-funciona" className="text-white font-bangers text-xl no-underline italic">
          COMO FUNCIONA
        </Link>
        <Link to="/sobre-nosotros" className="text-white font-bangers text-xl no-underline italic">
          SOBRE NOSOTROS
        </Link>
        <Link to="/contacto" className="text-white font-bangers text-xl no-underline italic">
          CONTACTANOS
        </Link>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link to="/register" className="register-btn">
          REGISTRATE
        </Link>
        <Link
          to="/login"
          className="bg-red-600 text-white rounded-full px-5 py-1 font-bangers text-lg no-underline italic"
        >
          INGRESAR
        </Link>
      </div>
    </nav>
  )
}

export default NavBar
