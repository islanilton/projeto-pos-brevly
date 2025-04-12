import { createLink } from '@/app/services/create-link'
import { isLeft } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create an link',
        tags: ['links'],
        body: z.object({
          originalUrl: z.string().url(),
          shortUrl: z.string(),
        }),
        response: {
          201: z.object({ 
            id: z.string(),
            originalUrl: z.string().url(),
            shortUrl: z.string(),
            createdAt: z.date(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body
      const result = await createLink({ originalUrl, shortUrl })
      if (isLeft(result)) {
        return reply.status(400).send({ message: result.left.message })
      }
      return reply.status(201).send({
        id: result.right.id,
        originalUrl: result.right.originalUrl,
        shortUrl: result.right.shortUrl,
        createdAt: result.right.createdAt,
      })
    }
  )
}