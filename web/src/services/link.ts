import { api } from '../lib/axios'
import type { CreateLinkData, CreateLinkResponse, Link } from '../types/link'

export async function createLink(data: CreateLinkData): Promise<Link> {
  const response = await api.post<Link>('/links', data)
  return response.data
}

export async function getLinks(): Promise<Link[]> {
  const response = await api.get<{ links: Link[] }>('/links')
  return response.data.links
}

export async function deleteLink(id: string): Promise<void> {
  await api.delete(`/links/${id}`)
}

export async function getLinkByShortUrl(shortUrl: string): Promise<Link> {
  const response = await api.get<Link>(`/links/${shortUrl}`)
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

