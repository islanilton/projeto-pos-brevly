import { env } from '@/env'

import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'

import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { routes } from './routes'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }
  console.error(error)
  reply.status(500).send({
    message: 'Internal server error',
  })
})

server.register(fastifyCors, { origin: '*' })
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brevly Server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

for (const route of routes) {
  server.register(route)
}

server
  .listen({
    port: env.PORT,
    host: env.HOSTNAME || '0.0.0.0',
  })
  .then(() => console.log('HTTP server running'))
