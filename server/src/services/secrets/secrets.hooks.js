const { authenticate } = require('@feathersjs/authentication').hooks
const { iff } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [
      context => {
        console.log('QUERY BEFORE')
        console.log(context.params.query)
        console.log(context.params.user)
        return context
      },
      // If a token was included, authenticate it with the `jwt` strategy.
      iff(
        context => context.params.user,
        authenticate('jwt'),
        context => {
          console.log('Authenticated')

          Object.assign(context.params.query, {
            userId: context.params.user._id
            // userId: { $in: [context.params.user._id, null] }
          })
          return context
        }
        // No token was found, so limit the query to include `public: true`
      ).else(context => {
        console.log('Unauthenticated')
        Object.assign(context.params.query, { userId: null })
        return context
      }),
      context => {
        console.log('QUERY AFTER')
        console.log(context.params.query)
        return context
      }
    ],
    get: [authenticate('jwt')],
    create: [],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [
      context => {
        console.log('REQUEST PROCeSSED')
        return context
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
