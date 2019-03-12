const bcrypt = require('bcryptjs')
const fs = require('fs-extra')
const path = require('path')
const loremIpsum = require('lorem-ipsum')
let User
let Secret

const BCRYPT_WORK_FACTOR_BASE = 12
const BCRYPT_DATE_BASE = 1483228800000
const BCRYPT_WORK_INCREASE_INTERVAL = 47300000000

const hasher = password => {
  return new Promise((resolve, reject) => {
    let BCRYPT_CURRENT_DATE = new Date().getTime()
    let BCRYPT_WORK_INCREASE = Math.max(
      0,
      Math.floor(
        (BCRYPT_CURRENT_DATE - BCRYPT_DATE_BASE) / BCRYPT_WORK_INCREASE_INTERVAL
      )
    )
    let BCRYPT_WORK_FACTOR = Math.min(
      19,
      BCRYPT_WORK_FACTOR_BASE + BCRYPT_WORK_INCREASE
    )

    bcrypt.genSalt(BCRYPT_WORK_FACTOR, function(error, salt) {
      if (error) {
        return reject(error)
      }

      bcrypt.hash(password, salt, function(error, hashedPassword) {
        if (error) {
          return reject(error)
        }

        resolve(hashedPassword)
      })
    })
  })
}

const rndAr = (n = 100, len = 10) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * n))

const wait = async () =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, 1000)
  })

const cleanUp = async app => {
  return new Promise((resolve, reject) => {
    User.remove({}, { multi: true }, err => {
      if (err) {
        return reject(err)
      }
      Secret.remove({}, { multi: true }, (err, numRemoved) => {
        return err ? reject(err) : resolve(numRemoved)
      })
    })
  })
  // const dbPath = app.get('nedb')
  // let dbFile = path.join(dbPath, 'users.db')
  // await fs.outputFile(dbFile, '')
  // dbFile = path.join(dbPath, 'secrets.db')
  // await fs.outputFile(dbFile, '')
}

module.exports = async function(app) {
  User = require('./models/users.model')(app)
  Secret = require('./models/secrets.model')(app)

  await wait()
  await cleanUp(app)
  await wait()

  let promises = ['admin', 'user']
    .map(async (label, idx) => {
      const hash = await hasher(label)
      const email = `${label}@example.com`

      return new Promise((resolve, reject) => {
        User.insert(
          {
            email: email,
            password: hash
          },
          (err, u) => {
            if (err) {
              return reject(err)
            }
            console.log(`user inserted (${u.email}), inserting secrets`)
            rndAr().map(a => {
              Secret.insert(
                {
                  title: loremIpsum({
                    count: 1,
                    sentenceLowerBound: 4,
                    sentenceUpperBound: 10,
                    units: 'sentences'
                  }),
                  message: loremIpsum({
                    units: 'paragraphs'
                  }),
                  userId: u._id
                },
                (err, msg) => {
                  console.log('secret inserted: ')
                  return err ? reject(err) : resolve(msg)
                }
              )
            })
          }
        )
      })
    })
    .concat(
      rndAr(3).map(a => {
        return new Promise((resolve, reject) => {
          Secret.insert(
            {
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
            },
            (err, msg) => {
              console.log('secret inserted: ')
              return err ? reject(err) : resolve(msg)
            }
          )
        })
      })
    )

  return Promise.all(promises)
}
