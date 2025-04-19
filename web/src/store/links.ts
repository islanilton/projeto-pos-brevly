import { create } from 'zustand'
import type { Link } from '../types/link'

interface LinksState {
  links: Link[]
  isLoading: boolean
  isCreating: boolean
  isExporting: boolean
  setLinks: (links: Link[]) => void
  addLink: (link: Link) => void
  updateAccessCount: (shortUrl: string, accessCount: number) => void
  checkPendingAccessCount: () => void
  setIsLoading: (isLoading: boolean) => void
  setIsCreating: (isCreating: boolean) => void
  setIsExporting: (isExporting: boolean) => void
}

const PENDING_ACCESS_KEY = '@brevly:pending-access'

export const useLinksStore = create<LinksState>((set) => ({
  links: [],
  isLoading: false,
  isCreating: false,
  isExporting: false,
  setLinks: (links) => set({ links }),
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  updateAccessCount: (shortUrl, accessCount) => {
    // Salva no localStorage para persistir entre navegações
    localStorage.setItem(PENDING_ACCESS_KEY, JSON.stringify({ shortUrl, accessCount }))
    
    set((state) => ({
      links: state.links.map((link) =>
        link.shortUrl === shortUrl ? { ...link, accessCount } : link
      ),
    }))
  },
  checkPendingAccessCount: () => {
    const pendingData = localStorage.getItem(PENDING_ACCESS_KEY)
    if (pendingData) {
      try {
        const { shortUrl, accessCount } = JSON.parse(pendingData)
        set((state) => ({
          links: state.links.map((link) =>
            link.shortUrl === shortUrl ? { ...link, accessCount } : link
          ),
        }))
      } catch (error) {
        console.error('Error parsing pending access count:', error)
      } finally {
        localStorage.removeItem(PENDING_ACCESS_KEY)
      }
    }
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setIsExporting: (isExporting) => set({ isExporting }),
})) 