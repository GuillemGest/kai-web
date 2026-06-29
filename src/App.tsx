import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './ui/layouts/PublicLayout'
import { MainPage } from './ui/pages/MainPage/MainPage'
import { LoginPage } from './ui/pages/LoginPage/LoginPage'
import { DownloadPage } from './ui/pages/DownloadPage/DownloadPage'
import { ShopPage } from './ui/pages/ShopPage/ShopPage'
import { AccountPage } from './ui/pages/AccountPage/AccountPage'
import { SupportPage } from './ui/pages/SupportPage/SupportPage'
import { CompanyPage } from './ui/pages/CompanyPage/CompanyPage'
import { NotFoundPage } from './ui/pages/NotFoundPage/NotFoundPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/descargar" element={<DownloadPage />} />
          <Route path="/planes" element={<ShopPage />} />
          <Route path="/cuenta" element={<AccountPage />} />
          <Route path="/soporte" element={<SupportPage />} />
          <Route path="/empresa" element={<CompanyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
