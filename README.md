# Nuxt & Feathers Not Authenticated on page reload Error

## Build Setup

```javascript
# install
$ cd front && yarn install && cd ../server && yarn install

# terminal 1
$ yarn run dev

# terminal 2
$ yarn run dev
```

## Bug reproduction

1. Point your browser to http://localhost:3000  
   Note the yellow `Public secret` tag next to each message  
   _if you don't see any message, restart the server_

2. Go to the login page `http://localhost:3000/login`

3. Login with credentials `admin@example.com` / `admin`  
   Note the `My personal secret` green tag next to each message

4. Reload the page (Ctrl+R or F5 or whatever)
5. Note the yellow f\* tags
6. Scream in despair :( :'(

## Credits

Credits to [Matt Chaffe](https://medium.com/@mattchewone) for his [FeathersJS / Nuxt / SSR Authentication article](https://medium.com/@mattchewone/feathersjs-nuxt-ssr-authentication-75e97b6ce125)
