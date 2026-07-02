import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LocaleProvider } from './i18n/LocaleContext'
import { PublicLayout } from './ui/layouts/PublicLayout'
import { MainPage } from './ui/pages/MainPage/MainPage'
import { LoginPage } from './ui/pages/LoginPage/LoginPage'
import { ShopPage } from './ui/pages/ShopPage/ShopPage'
import { AccountPage } from './ui/pages/AccountPage/AccountPage'
import { ResourcesPage } from './ui/pages/ResourcesPage/ResourcesPage'
import { GuidePage } from './ui/pages/GuidePage/GuidePage'
import { CompanyPage } from './ui/pages/CompanyPage/CompanyPage'
import { NotFoundPage } from './ui/pages/NotFoundPage/NotFoundPage'

function App() {
  return (
    <LocaleProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/planes" element={<ShopPage />} />
            <Route path="/cuenta" element={<AccountPage />} />
            <Route path="/recursos" element={<ResourcesPage />} />
            <Route path="/recursos/guias/:slug" element={<GuidePage />} />
            <Route path="/empresa" element={<CompanyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  )
}

export default App
