import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from './ui/pages/MainPage/MainPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
