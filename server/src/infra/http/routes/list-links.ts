import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const listLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get('/links', () => {
    return {
      message: 'Listed Links!!',
    }
  })
}