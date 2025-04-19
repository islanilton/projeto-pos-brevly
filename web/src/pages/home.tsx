import { useEffect } from 'react'
import { LinkForm } from '../components/link-form'
import { LinkList } from '../components/link-list'
import { Header } from '../components/header'
import { getLinks } from '../services/link'
import { useLinksStore } from '../store/links'
import type { Link } from '../types/link'

export function Home() {
  const { 
    links, 
    isCreating, 
    setLinks, 
    setIsLoading,
    checkPendingAccessCount 
  } = useLinksStore()

  // Verifica contadores pendentes quando o componente monta
  useEffect(() => {
    checkPendingAccessCount()
  }, [checkPendingAccessCount])

  // Carrega os links e verifica novamente os contadores pendentes
  useEffect(() => {
    async function initialize() {
      await loadLinks()
      checkPendingAccessCount()
    }
    initialize()
  }, [checkPendingAccessCount])

  // Adiciona um listener para quando a página ganhar foco
  useEffect(() => {
    function handleFocus() {
      checkPendingAccessCount()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [checkPendingAccessCount])

  async function loadLinks() {
    try {
      setIsLoading(true)
      const data = await getLinks()
      setLinks(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleDeleteLink(shortUrl: string) {
    setLinks(links.filter(link => link.shortUrl !== shortUrl))
  }

  function handleLinkCreated(newLink: Link) {
    setLinks([newLink, ...links])
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Header />
      
      <main className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-[#1A202C] mb-6">
                Novo link
              </h1>
              
              <LinkForm onSuccess={handleLinkCreated} />
            </div>
          </div>

          {/* Right Column - List */}
          <LinkList onDelete={handleDeleteLink} isCreating={isCreating} />
        </div>
      </main>
    </div>
  )
} 