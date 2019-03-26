# Nuxt & Feathers SSR models are not \$FeathersVuex instances

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

1. Point your browser to http://localhost:9999  
   Note the yellow `Public secret` tag next to each message  
   _if you don't see any message, restart the server_

2. Go to the login page `http://localhost:9999/login`

3. Login with credentials `admin@example.com` / `admin`
4. On the index page, click on the `Edit User` button to go to `http://localhost:9999/0`
5. Reload the page (Ctrl+R or F5 or whatever)
6. F!#?@!\$ ☠ 💀💩👻💣💥 Error  
   ![F!#?@!$ Error](https://raw.githubusercontent.com/Cl3MM/nuxt-feathers-page-reload-auth-error/master/front/assets/error.png)
7. Scream in despair :( :'(

## Credits

Credits to [Matt Chaffe](https://medium.com/@mattchewone) for his [FeathersJS / Nuxt / SSR Authentication article](https://medium.com/@mattchewone/feathersjs-nuxt-ssr-authentication-75e97b6ce125)
