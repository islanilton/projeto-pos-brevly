import { api } from '../lib/axios'
import type { CreateLinkData, Link } from '../types/link'

interface RedirectResponse {
  originalUrl: string
  accessCount: number
}

interface PaginatedLinksResponse {
  links: Link[]
  total: number
}

export async function createLink(data: CreateLinkData): Promise<Link> {
  const response = await api.post<Link>('/links', data)
  return response.data
}

export async function getLinks(page = 1): Promise<PaginatedLinksResponse> {
  const response = await api.get<PaginatedLinksResponse>('/links', {
    params: {
      page,
      per_page: 20
    }
  })
  return response.data
}

export async function deleteLink(shortUrl: string): Promise<void> {
  await api.delete(`/links/${shortUrl}`)
}

export async function getLinkByShortUrl(shortUrl: string): Promise<Link> {
  const response = await api.get<Link>(`/links/${shortUrl}`)
  return response.data
}

export async function redirectToUrl(shortUrl: string): Promise<RedirectResponse> {
  const response = await api.get<RedirectResponse>(`/links/${shortUrl}/redirect`)
  return response.data
}

export async function exportLinks(): Promise<void> {
  const response = await api.get<{ reportUrl: string }>('/links/export')
  const { reportUrl } = response.data
  const link = document.createElement('a')
  link.href = reportUrl
  link.setAttribute('download', 'links.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 

