import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Redirect } from './pages/Redirect'
import { Toaster } from 'react-hot-toast'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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