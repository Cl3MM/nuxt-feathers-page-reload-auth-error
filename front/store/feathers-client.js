import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

export const host = process.env.API_HOST || 'http://localhost:8888'

export default (origin, storage) => {
  const socket = io(host, {
    transports: ['websocket'],
    extraHeaders: {
      origin: origin || ''
    }
  })

  const feathersClient = feathers()
    .configure(
      socketio(socket, {
        timeout: 1000 * 60 * 10 // 10min timeout
      })
    )
    .configure(auth({ storage }))

  return feathersClient
}
