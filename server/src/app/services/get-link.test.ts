import { describe, expect, it, vi } from 'vitest'
import { getLink } from './get-link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { LinkNotFound } from './errors'

vi.mock('@/infra/db', () => ({
  db: {
    query: {
      links: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue(undefined),
      })),
    })),
  },
}))

describe('getLink', () => {
  it('should get a link and increment access count when it exists', async () => {
    const mockLink = {
      id: '123',
      originalUrl: 'https://example.com',
      shortUrl: 'example',
      accessCount: '5',
      createdAt: new Date(),
    }
    vi.mocked(db.query.links.findFirst).mockResolvedValueOnce(mockLink)
    const result = await getLink('example')
    expect(result.right).toBeDefined()
    if (result.right) {
      expect(result.right).toEqual({
        originalUrl: 'https://example.com',
        accessCount: 6,
      })
    }
    expect(db.update).toHaveBeenCalledWith(schema.links)
  })

  it('should return LinkNotFound when link does not exist', async () => {
    vi.mocked(db.query.links.findFirst).mockResolvedValueOnce(undefined)
    const result = await getLink('example')
    expect(result.left).toBeInstanceOf(LinkNotFound)
  })
}) 