import { useEffect } from 'react'
import type { Link } from '../../types/link'
import { deleteLink, exportLinks } from '../../services/link'
import { useLinksStore } from '../../store/links'
import { Button } from '../Button'

interface LinkListProps {
  onDelete: (id: string) => void
  isCreating?: boolean
}

export function LinkList({ onDelete, isCreating = false }: LinkListProps) {
  const { links, isLoading, isExporting, setIsExporting } = useLinksStore()

  const showLoading = isLoading || isCreating

  async function handleCopy(shortUrl: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/${shortUrl}`)
  }

  async function handleDelete(id: string) {
    try {
      await deleteLink(id)
      onDelete(id)
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
                    className="p-2 text-zinc-700 bg-gray-300 hover:text-[#2B6CB0] rounded-md transition-colors"
                    title="Copiar link"
                    aria-label="Copiar link"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4.16675 12.5H3.33341C2.89139 12.5 2.46746 12.3244 2.15491 12.0118C1.84235 11.6993 1.66675 11.2754 1.66675 10.8333V3.33334C1.66675 2.89131 1.84235 2.46739 2.15491 2.15483C2.46746 1.84227 2.89139 1.66667 3.33341 1.66667H10.8334C11.2754 1.66667 11.6994 1.84227 12.0119 2.15483C12.3245 2.46739 12.5001 2.89131 12.5001 3.33334V4.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-zinc-700 bg-gray-300 hover:text-red-600 rounded-md transition-colors"
                    title="Excluir link"
                    aria-label="Excluir link"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M2.5 5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15.8334 5V16.6667C15.8334 17.5 15 18.3333 14.1667 18.3333H5.83341C5.00008 18.3333 4.16675 17.5 4.16675 16.6667V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.66675 4.99999V3.33332C6.66675 2.49999 7.50008 1.66666 8.33341 1.66666H11.6667C12.5001 1.66666 13.3334 2.49999 13.3334 3.33332V4.99999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.33325 9.16666V14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.6667 9.16666V14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 