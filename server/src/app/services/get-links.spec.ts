import { randomUUID } from 'node:crypto'
import { getLinks } from '@/app/services/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'

describe('get links', () => {
  it('should be able to get the links', async () => {
    const originalUrl = randomUUID()

    const link1 = await makeLink({ originalUrl })
    const link2 = await makeLink({ originalUrl })
    const link3 = await makeLink({ originalUrl })
    const link4 = await makeLink({ originalUrl })
    const link5 = await makeLink({ originalUrl })

    const sut = await getLinks({
      searchQuery: originalUrl,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to get paginated uploads', async () => {
    const originalUrlPattern = randomUUID()

    const link1 = await makeLink({ originalUrl: `${originalUrlPattern}` })
    const link2 = await makeLink({ originalUrl: `${originalUrlPattern}` })
    const link3 = await makeLink({ originalUrl: `${originalUrlPattern}` })
    const link4 = await makeLink({ originalUrl: `${originalUrlPattern}` })
    const link5 = await makeLink({ originalUrl: `${originalUrlPattern}` })

    let sut = await getLinks({
      searchQuery: originalUrlPattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await getLinks({
      searchQuery: originalUrlPattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to get sorted uploads', async () => {
    const originalUrl = randomUUID()

    const link1 = await makeLink({ originalUrl, createdAt: new Date('2024-01-01') })
    const link2 = await makeLink({ originalUrl, createdAt: new Date('2024-01-02') })
    const link3 = await makeLink({ originalUrl, createdAt: new Date('2024-01-03') })
    const link4 = await makeLink({ originalUrl, createdAt: new Date('2024-01-04') })
    const link5 = await makeLink({ originalUrl, createdAt: new Date('2024-01-05') })

    let sut = await getLinks({
      searchQuery: originalUrl,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])

    sut = await getLinks({
      searchQuery: originalUrl,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link1.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link5.id }),
    ])
  })
})
