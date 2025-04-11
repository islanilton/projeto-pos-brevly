import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get('/links/export', () => {
    return {
      message: 'Exported Links',
    }
  })
}