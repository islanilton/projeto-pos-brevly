import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

interface DeleteLinkParams {
  id: string
}

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete<{ Params: DeleteLinkParams }>('/links/:id', ({ params }) => {
    return {
      message: `Deleted Link ${params.id}`,
    }
  })
}