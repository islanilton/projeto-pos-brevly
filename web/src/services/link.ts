import { api } from '../lib/axios'
import type { CreateLinkData, Link } from '../types/link'

interface RedirectResponse {
  originalUrl: string
  accessCount: number
}

export async function createLink(data: CreateLinkData): Promise<Link> {
  const response = await api.post<Link>('/links', data)
  return response.data
}

export async function getLinks(): Promise<Link[]> {
  const response = await api.get<{ links: Link[] }>('/links')
  return response.data.links
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
  const response = await api.get('/links/export', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'links.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
} 

