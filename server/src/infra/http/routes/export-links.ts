import { exportLinks } from '@/app/services/export-links'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/export',
    {
      schema: {
        summary: 'Export uploads',
        tags: ['links'],
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      const result = await exportLinks()
      const { reportUrl } = unwrapEither(result)
      return reply.status(200).send({ reportUrl })
    }
  )
}
