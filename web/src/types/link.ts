export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: string
  accessCount: number
}

export interface CreateLinkData {
  originalUrl: string
  shortUrl?: string
} 