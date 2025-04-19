import { useState } from 'react'
import { deleteLink, exportLinks } from '../services/link'
import { useLinksStore } from '../store/links'
import ConfirmDeleteModal from './confirm-delete-modal'
import { Button } from './ui/button'
import trashIcon from '../assets/images/trash.svg'
import copyIcon from '../assets/images/copy.svg'
interface LinkListProps {
  onDelete: (id: string) => void
  isCreating?: boolean
}

export function LinkList({ onDelete, isCreating = false }: LinkListProps) {
  const { links, isLoading, isExporting, setIsExporting } = useLinksStore()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const showLoading = isLoading || isCreating

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-[#1A202C]">Meus links</h2>
          <Button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            variant="secondary"
          >
            {isExporting ? 'Baixando...' : 'Baixar CSV'}
          </Button>
        </div>

        {showLoading && !links.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg 
              className="animate-spin h-5 w-5 text-zinc-500 mb-2" 
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
            <span className="text-zinc-500">Carregando links...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-[#2B6CB0]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13.5 10.5L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 3L21 3L21 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 21L3 21L3 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[#1A202C] font-medium">
              AINDA NÃO EXISTEM LINKS CADASTRADOS
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between py-4 border-b border-[#E2E8F0] last:border-0"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <a
                    href={`/${link.shortUrl}`}
                    className="text-[#2B6CB0] hover:text-[#2C5282] font-medium mb-1 block"
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
                    {link.accessCount} acessos
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