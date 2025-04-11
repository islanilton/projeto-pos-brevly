import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { z } from 'zod'

import { eq } from 'drizzle-orm'
import { InvalidShortUrlFormat, ShortUrlAlreadyExists } from './errors'


const createLinkInput = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string().regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, {
    message: 'Short URL must contain only letters, numbers, and hyphens, and cannot start or end with a hyphen',
  }),
})

type CreateLinkOutput = {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: Date
}

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<InvalidShortUrlFormat | ShortUrlAlreadyExists, CreateLinkOutput>> {
  try {
    const { originalUrl, shortUrl } = createLinkInput.parse(input)

    const link = await db.query.links.findFirst({
      where: eq(schema.links.shortUrl, shortUrl),
    })

    console.log(link)

    if (link) {
      return makeLeft(new ShortUrlAlreadyExists())
    }

    const newLink = await db.insert(schema.links).values({
      originalUrl,
      shortUrl,
    }).returning()

    return makeRight({
      id: newLink[0].id,
      originalUrl: newLink[0].originalUrl,
      shortUrl: newLink[0].shortUrl,
      createdAt: newLink[0].createdAt,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return makeLeft(new InvalidShortUrlFormat())
    }
    throw error
  }
}
