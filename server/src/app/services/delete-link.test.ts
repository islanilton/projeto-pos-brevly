import { describe, expect, it, vi } from 'vitest'
import { deleteLink } from './delete-link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { LinkNotFound } from './errors'
import { eq } from 'drizzle-orm'

vi.mock('@/infra/db', () => ({
  db: {
    query: {
      links: {
        findFirst: vi.fn(),
      },
    },
    delete: vi.fn().mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => Promise.resolve({})),
    })),
  },
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn().mockImplementation((column, value) => ({
    column,
    value,
  })),
}))

describe('deleteLink', () => {
  it('should delete a link when it exists', async () => {
    const mockLink = {
      id: '123',
      originalUrl: 'https://example.com',
      shortUrl: 'example',
      accessCount: '0',
      createdAt: new Date(),
    }
    vi.mocked(db.query.links.findFirst).mockResolvedValueOnce(mockLink)
    const result = await deleteLink('example')
    expect(result.right).toBeUndefined()
    expect(db.delete).toHaveBeenCalledWith(schema.links)
    expect(eq).toHaveBeenCalledWith(schema.links.shortUrl, 'example')
  })

  it('should return LinkNotFound when link does not exist', async () => {
    vi.mocked(db.query.links.findFirst).mockResolvedValueOnce(undefined)
    const result = await deleteLink('example')
    expect(result.left).toBeInstanceOf(LinkNotFound)
  })
}) 