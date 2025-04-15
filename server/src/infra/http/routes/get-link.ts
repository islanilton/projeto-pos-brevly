import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getLink } from '@/app/services/get-link'
import { LinkNotFound } from '@/app/services/errors'
import { z } from 'zod'
import { isLeft } from '@/infra/shared/either'

interface GetLinkParams {
  shortUrl: string
}

export const getLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get<{ Params: GetLinkParams }>(
    '/links/:shortUrl',
    {
      schema: {
        summary: 'Get Link by Short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.object({
            originalUrl: z.string(),
            accessCount: z.number(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async ({ params }, reply) => {
      const result = await getLink(params.shortUrl)

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message })
      }

      return reply.status(200).send(result.right)
    }
  )
}