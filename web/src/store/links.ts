import { create } from 'zustand'
import type { Link } from '../types/link'

interface LinksState {
  links: Link[]
  isLoading: boolean
  isCreating: boolean
  isExporting: boolean
  setLinks: (links: Link[]) => void
  addLink: (link: Link) => void
  setIsLoading: (isLoading: boolean) => void
  setIsCreating: (isCreating: boolean) => void
  setIsExporting: (isExporting: boolean) => void
}

export const useLinksStore = create<LinksState>((set) => ({
  links: [],
  isLoading: false,
  isCreating: false,
  isExporting: false,
  setLinks: (links) => set({ links }),
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setIsExporting: (isExporting) => set({ isExporting }),
})) 