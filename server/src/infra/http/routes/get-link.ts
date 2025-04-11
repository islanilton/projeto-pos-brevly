import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

interface GetLinkParams {
  id: string
}

export const getLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get<{ Params: GetLinkParams }>('/links/:id', ({ params }) => {
    return {
      message: `Get Link ${params.id}`,
    }
  })
}