import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { redirectToUrl } from '../services/link'
import { useLinksStore } from '../store/links'
import logoRedirect from '../assets/images/logo-redirect-page.svg'

export function Redirect() {
  const { shortUrl } = useParams()
  const navigate = useNavigate()
  const [targetUrl, setTargetUrl] = useState<string>('')
  const hasRedirected = useRef(false)
  const updateAccessCount = useLinksStore(state => state.updateAccessCount)

  useEffect(() => {
    if (!shortUrl || shortUrl === '404') {
      navigate('/404', { replace: true })
      return
    }

    async function handleRedirect(url: string) {
      if (hasRedirected.current) return
      try {
        hasRedirected.current = true
        const { originalUrl, accessCount } = await redirectToUrl(url)
        setTargetUrl(originalUrl)
        updateAccessCount(url, accessCount)
        setTimeout(() => {
          window.location.href = originalUrl
        }, 500)
      } catch (error) {
        navigate('/404', { replace: true })
      }
    }

    handleRedirect(shortUrl)
  }, [shortUrl, navigate, updateAccessCount])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
        <img 
          src={logoRedirect} 
          alt="Logo" 
          className="mx-auto mb-6"
          style={{ width: '64px', height: '64px' }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecionando...
        </h1>
        <p className="text-gray-600 mb-2">
          O link será aberto automaticamente em alguns instantes.
        </p>
        <p className="text-gray-600">
          Não foi redirecionado?{' '}
          <button 
            type="button"
            onClick={() => {
              if (targetUrl) {
                window.location.href = targetUrl
              }
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Acesse aqui
          </button>
        </p>
      </div>
    </div>
  )
} 