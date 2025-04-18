import React from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLinkByShortUrl } from '../../services/link'

export function Redirect() {
  const { shortUrl } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function redirect() {
      try {
        const link = await getLinkByShortUrl(shortUrl!)
        window.location.href = link.url
      } catch (error) {
        navigate('/404')
      }
    }

    redirect()
  }, [shortUrl, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecionando...
        </h1>
        <p className="text-gray-500">
          Aguarde enquanto você é redirecionado para a página desejada.
        </p>
      </div>
    </div>
  )
} 