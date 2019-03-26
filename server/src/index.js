/* eslint-disable no-console */
const logger = require('./logger')
const app = require('./app')
const port = app.get('port')
const server = app.listen(port)
// const seed = require('./seed')

// ;(async () => {
//   console.log(`[seeder] start seeding database`)
//   await seed(app)
//     .then(() => {
//       console.log(`[seeder] database seeded`)
//     })
//     .catch(e => {
//       console.error(`[seeder] unable to seed database`)
//       console.error(e)
//     })
// })()

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () =>
  logger.info(
    'Feathers application started on http://%s:%d',
    app.get('host'),
    port
  )
)
