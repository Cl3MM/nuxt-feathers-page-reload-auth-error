const loremIpsum = require('lorem-ipsum')

const rndAr = (n = 100, len = 10) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * n))

const cleanUp = async app => {
  await app.service('secrets').remove(null, {})
  await app.service('users').remove(null, {})
}

module.exports = async function (app) {
  await cleanUp(app)

  await Promise.all(['admin', 'user']
    .map(async (label, idx) => {
      const email = `${label}@example.com`

      const user = await app.service('users').create({
        email,
        password: label
      })

      await Promise.all(rndAr().map(async a => {
        await app.service('secrets').create({
          title: loremIpsum({
            count: 1,
            sentenceLowerBound: 4,
            sentenceUpperBound: 10,
            units: 'sentences'
          }),
          message: loremIpsum({
            units: 'paragraphs'
          }),
          userId: user._id
        })
      })
      )

      await Promise.all(rndAr().map(async a => {
        await app.service('secrets').create({
          title: loremIpsum({
            count: 1,
            sentenceLowerBound: 4,
            sentenceUpperBound: 10,
            units: 'sentences'
          }),
          message: loremIpsum({
            units: 'paragraphs'
          }),
          userId: null
        })
      }))
    })
  )
}
