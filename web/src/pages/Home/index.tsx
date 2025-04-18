import { useEffect } from 'react'
import { LinkForm } from '../../components/LinkForm'
import { LinkList } from '../../components/LinkList'
import { Header } from '../../components/Header'
import { getLinks } from '../../services/link'
import { useLinksStore } from '../../store/links'
import type { Link } from '../../types/link'

export function Home() {
  const { links, isLoading, isCreating, setLinks, setIsLoading } = useLinksStore()

  useEffect(() => {
    loadLinks()
  }, [])

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

  function handleDeleteLink(id: string) {
    setLinks(links.filter(link => link.id !== id))
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