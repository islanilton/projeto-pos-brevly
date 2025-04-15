import { describe, it, expect, beforeEach } from 'vitest'
import { createLink } from './create-link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/infra/shared/either'

describe('Create Link Service', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should be able to create a new link', async () => {
    const result = await createLink({
      originalUrl: 'https://example.com',
      shortUrl: 'test123',
    })
    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.right).toEqual(
        expect.objectContaining({
          originalUrl: 'https://example.com',
          shortUrl: 'test123',
        })
      )
    }
  })

  it.todo('should not be able to create a link with invalid short URL format', async () => {
    const result = await createLink({
      originalUrl: 'https://example.com',
      shortUrl: 'test@123',
    })
    expect(isLeft(result)).toBe(true)
  })

  it.todo('should not be able to create a link with duplicate short URL', async () => {
    await createLink({
      originalUrl: 'https://example1.com',
      shortUrl: 'test123',
    })
    const result = await createLink({
      originalUrl: 'https://example2.com',
      shortUrl: 'test123',
    })
    expect(isLeft(result)).toBe(true)
  })
}) 