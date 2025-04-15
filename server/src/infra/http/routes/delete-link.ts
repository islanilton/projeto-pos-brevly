import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteLink } from '@/app/services/delete-link'
import { LinkNotFound } from '@/app/services/errors'
import { z } from 'zod'
import { isLeft } from '@/infra/shared/either'

interface DeleteLinkParams {
  shortUrl: string
}

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete<{ Params: DeleteLinkParams }>(
    '/links/:shortUrl',
    {
      schema: {
        summary: 'Delete Link by Short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          204: z.void(),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async ({ params }, reply) => {
      const result = await deleteLink(params.shortUrl)

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message })
      }

      return reply.status(204).send()
    }
  )
}