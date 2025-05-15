import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./layouts/client/Header"

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0 }}>
        <Header />
        <main style={{ padding: "16px" }}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/como-funciona" element={<div>Cómo funciona</div>} />
            <Route path="/sobre-nosotros" element={<div>Sobre nosotros</div>} />
            <Route path="/contacto" element={<div>Contacto</div>} />
            <Route path="/registro" element={<div>Registro</div>} />
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
