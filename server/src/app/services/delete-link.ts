import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { LinkNotFound } from './errors'

export async function deleteLink(
  shortUrl: string
): Promise<Either<LinkNotFound, void>> {
  const link = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  await db.delete(schema.links).where(eq(schema.links.shortUrl, shortUrl))

  return makeRight(undefined)
} 