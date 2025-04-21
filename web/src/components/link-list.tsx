import { useState, useRef, useEffect } from 'react'
import { deleteLink, exportLinks } from '../services/link'
import { useLinksStore } from '../store/links'
import ConfirmDeleteModal from './confirm-delete-modal'
import { Button } from './ui/button'
import trashIcon from '../assets/images/trash.svg'
import copyIcon from '../assets/images/copy.svg'
import downloadIcon from '../assets/images/download.svg'
import linkIcon from '../assets/images/link.svg'

interface LinkListProps {
  onDelete: (id: string) => void
  isCreating?: boolean
  onLoadMore: () => void
}

export function LinkList({ onDelete, isCreating = false, onLoadMore }: LinkListProps) {
  const { links, isLoading, isExporting, hasNextPage, setIsExporting } = useLinksStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const showLoading = isLoading || isCreating

  useEffect(() => {
    const listElement = listRef.current
    if (!listElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isLoading) {
          onLoadMore()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    listElement.appendChild(sentinel)
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [hasNextPage, isLoading, onLoadMore])

  async function handleCopy(shortUrl: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/${shortUrl}`)
  }

  async function handleDelete(shortUrl: string) {
    try {
      await deleteLink(shortUrl)
      onDelete(shortUrl)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleExportCSV() {
    try {
      setIsExporting(true)
      await exportLinks()
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
      {showLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5">
          <div className="h-full w-1/3 bg-[#2B6CB0] animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-gray-600">Meus links</h2>
          <div className="bg-gray-50 rounded-lg">
            <Button
              type="button"
              onClick={handleExportCSV}
              disabled={isExporting || !links.length}
              className="flex items-center gap-2 bg-gray-200 rounded-md border border-gray-200 text-gray-500 disabled:bg-gray-200 disabled:hover:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200 hover:bg-gray-200 hover:border hover:border-gray-500 transition-colors"
            >
              <img src={downloadIcon} alt="Exportar CSV" className="w-4 h-4" />
              <span className="text-gray-500">{isExporting ? 'Baixando...' : 'Baixar CSV'}</span>
            </Button>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {showLoading && !links.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg 
              className="animate-spin h-5 w-5 text-gray-400 mb-2" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              role="img"
              aria-labelledby="loading-spinner"
            >
              <title id="loading-spinner">Loading spinner</title>
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
              />
            </svg>
            <span className="text-gray-400">Carregando links...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-blue-base">
              <img src={linkIcon} alt="Ícone de link" className="w-10 h-10" />
            </div>
            <p className="text-gray-500 font-medium">
              AINDA NÃO EXISTEM LINKS CADASTRADOS
            </p>
          </div>
        ) : (
          <div 
            ref={listRef}
            className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent hover:scrollbar-track-gray-100 scrollbar-thumb-blue-base hover:scrollbar-thumb-blue-dark transition-colors"
          >
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between py-4 border-b border-[#E2E8F0] last:border-0"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <a
                    href={`/${link.shortUrl}`}
                    className="text-blue-base hover:text-blue-dark font-bold mb-1 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    brev.ly/{link.shortUrl}
                  </a>
                  <p className="text-sm text-zinc-900 truncate">
                    {link.originalUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-900">
                    {link.accessCount || 0} acessos
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(link.shortUrl)}
                    className="w-10 h-10 flex items-center justify-center text-zinc-700 bg-gray-200 hover:border hover:border-zinc-700 rounded-md transition-colors"
                    title="Copiar link"
                    aria-label="Copiar link"
                  >
                    <img src={copyIcon} alt="Copiar link" className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLinkToDelete(link.shortUrl);
                      setIsModalOpen(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-zinc-700 bg-gray-200 hover:border hover:border-zinc-700 rounded-md transition-colors"
                    title="Excluir link"
                    aria-label="Excluir link"
                  >
                    <img src={trashIcon} alt="Excluir link" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {isLoading && hasNextPage && (
              <div className="flex justify-center py-4">
                <svg 
                  className="animate-spin h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Carregando mais links..."
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                  />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setLinkToDelete(null);
        }}
        onConfirm={() => {
          if (linkToDelete) {
            handleDelete(linkToDelete);
            setIsModalOpen(false);
            setLinkToDelete(null);
          }
        }}
        message={`Você quer realmente apagar o link ${linkToDelete}?`}
      />
    </div>
  )
} 