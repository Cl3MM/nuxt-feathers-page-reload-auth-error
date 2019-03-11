import Vuex from 'vuex'
import feathersVuex, { initAuth } from 'feathers-vuex'
import { CookieStorage } from 'cookie-storage'
import feathersClient from './feathers-client'

let plugins = []
// Create services for the browser
if (process.client) {
  const browserClient = feathersClient('', new CookieStorage())
  const { service: browserService, auth: browserAuth } = feathersVuex(
    browserClient,
    { idField: '_id', enableEvents: false }
  )

  plugins = [
    browserService('secrets', {
      autoRemove: true,
      replaceItems: true
    }),
    browserService('users', { paginate: true }),
    browserAuth({
      userService: 'users'
    })
  ]
}

const createStore = () => {
  return new Vuex.Store({
    state: {},
    actions: {
      nuxtServerInit({ commit, dispatch, state }, { req, store }) {
        console.log('==== NUXT SERVER INIT ====')
        let origin = req.headers.host.split(':')
        origin = `http://${origin[0]}`

        const storage = {
          getItem(key) {
            return store.state.auth ? store.state.auth.accessToken : ''
          },
          setItem(key, value) {
            store.state.auth.accessToken = value
          },
          removeItem(key) {
            store.state.auth.accessToken = null
          }
        }
        // Create a new client for the server
        const client = feathersClient(origin, storage)
        const { service, auth } = feathersVuex(client, {
          idField: '_id',
          enableEvents: false
        })
        service('secrets', {
          autoRemove: true,
          replaceItems: true
        })(store)
        // Register services for the server
        service('users', { paginate: true })(store)
        auth({
          userService: 'users'
        })(store)

        return initAuth({
          commit,
          dispatch,
          req,
          moduleName: 'auth',
          cookieName: 'feathers-jwt'
        })
          .then(response => {
            console.log('Authenticated!!!!')
            return dispatch('auth/authenticate', {
              accessToken: store.state.auth.accessToken,
              strategy: 'jwt'
            }).catch(e => {
              console.error('---- AUTHENTIcAtE ERROR ----')
              console.error(e)
            })
          })
          .catch(e => {
            console.error('|||| INIT AUTH ERROR ||||')
            console.error(e)
          })
      }
    },
    plugins
  })
}

export default createStore
