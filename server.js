const fastify = require('fastify')({ logger: true })
const PORT = 3000
const HOST = '0.0.0.0'

function handle(signal) {
    console.log(`*^!@4=> Received event: ${signal}`)
}
process.on('SIGHUP', handle)

async function closeGracefully(signal) {
    console.log(`*^!@4=> Received signal to terminate: ${signal}`)

    await fastify.close()
    // await db.close() if we have a db connection in this app
    // await other things we should cleanup nicely
    process.exit()
}
process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)

fastify.get('/delayed', async (request, reply) => {
  const SECONDS_DELAY = 60000
  await new Promise(resolve => {
      setTimeout(() => resolve(), SECONDS_DELAY)
  })
  return { hello: 'delayed world' }
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

const start = async () => {
  try {
    await fastify.listen(PORT, HOST)
    console.log(`*^!@4=> Process id: ${process.pid}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
