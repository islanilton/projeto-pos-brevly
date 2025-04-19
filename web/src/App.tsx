import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Redirect } from './pages/redirect'
import { Toaster } from 'react-hot-toast'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/:shortUrl" element={<Redirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          error: {
            icon: '⚠️',
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          }
        }}
      />
    </BrowserRouter>
  )
} 