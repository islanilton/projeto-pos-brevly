import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { LinkNotFound } from './errors'

type GetLinkOutput = {
  originalUrl: string
  accessCount: number
}

export async function getLink(
  shortUrl: string
): Promise<Either<LinkNotFound, GetLinkOutput>> {
  const link = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  await db
    .update(schema.links)
    .set({
      accessCount: String(Number(link.accessCount) + 1),
    })
    .where(eq(schema.links.shortUrl, shortUrl))

  return makeRight({
    originalUrl: link.originalUrl,
    accessCount: Number(link.accessCount) + 1,
  })
} 