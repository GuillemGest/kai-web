import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import './PublicLayout.css'

export function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <main className="public-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
