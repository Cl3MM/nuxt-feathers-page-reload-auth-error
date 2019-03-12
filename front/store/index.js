import Vue from 'vue'
import feathersVuex, { initAuth } from 'feathers-vuex'
import { CookieStorage } from 'cookie-storage'
import feathersClient from './feathers-client'

export const namespace = true

let _plugins = []

// Create services for the browser
if (process.client) {
  const browserClient = feathersClient('PROUT', new CookieStorage())
  const {
    service: browserService,
    auth: browserAuth,
    FeathersVuex
  } = feathersVuex(browserClient, { idField: '_id', enableEvents: false })
  Vue.use(FeathersVuex)

  _plugins = [
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

export const plugins = _plugins

export const state = () => ({})

export const actions = {
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
        console.log('IniT Auth OK!!!!')
        return dispatch('auth/authenticate', {
          accessToken: store.state.auth.accessToken,
          strategy: 'jwt'
        })
          .then(res => {
            console.log('auth/authenticate')
            console.log(res)
          })
          .catch(e => {
            console.error('---- AUTHENTIcAtE ERROR ----')
            console.error(e)
          })
      })
      .catch(e => {
        console.error('|||| INIT AUTH ERROR ||||')
        console.error(e)
      })
  }
}
