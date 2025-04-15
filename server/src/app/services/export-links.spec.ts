import { randomUUID } from 'node:crypto'
import { exportLinks } from '@/app/services/export-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

describe('export links', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should be able to export links', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const link1 = await makeLink()
    const link2 = await makeLink()

    const sut = await exportLinks()

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(csvAsArray).toEqual([
      ['ID', 'Original URL', 'Short URL','Access count', 'Created at'],
      [link1.id, link1.originalUrl, link1.shortUrl, link1.accessCount, expect.any(String)],
      [link2.id, link2.originalUrl, link2.shortUrl, link2.accessCount, expect.any(String)],
    ])
  })
})
