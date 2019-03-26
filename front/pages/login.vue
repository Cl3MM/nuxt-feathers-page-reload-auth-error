<template lang="pug">
  // login page stolen from: https://github.com/dansup/bulma-templates/blob/master/templates/login.html
  section#login-page.hero.is-login.is-fullheight
    .hero-body
      .container.has-text-centered
        .column.is-4.is-offset-4
          h3.title.has-text-primary Welcome !
          p.subtitle.has-text-primary Please enter your credentials
          b-message.has-text-centered(v-if="error", type='is-danger')
            | {{ error }}

          .box
            figure.avatar.is-64x64
              img(src='https://via.placeholder.com/64')
            .form
              .field
                .control
                  b-input.input.is-large(type="email", v-model="email", placeholder='Email' autofocus)
              .field
                .control
                  b-input.input.is-large(type="password", v-model="password", password-reveal, placeholder="Password")
              button.button.is-block.is-primary.is-large.is-fullwidth(@click="login", :disabled="!isValid", :class="{'is-loading': isAuthenticatePending || payload}")
                | Login

          p.has-text-primary
            nuxt-link(to='/') Home
            //- |  &nbsp;&middot;&nbsp;
            //- a(href='../') Besoin d'aide ?
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    email: 'admin@example.com',
    password: 'admin',
    redirect: '/',
    error: null,
    loading: false
  }),
  computed: {
    ...mapState('auth', ['isAuthenticatePending', 'payload']),
    isValid() {
      // return this.email && this.password
      return true
    }
  },
  mounted() {
    if (this.payload) {
      this.$router.push('/?signedin=true')
    }
    if (this.$route.query) {
      if (this.$route.query.redirect) {
        this.redirect = this.$route.query.redirect
      }
      if (this.$route.query.error) {
        this.error = this.$route.query.error
      }
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    login() {
      if (!this.isValid) return
      this.error = null

      this.authenticate({
        strategy: 'local',
        email: this.email,
        password: this.password
      })
        .then(data => {
          console.log(data)
          console.log(`redirecting to ${this.redirect}`)
          this.$router.push(this.redirect)
        })
        .catch(e => {
          console.error(e)
          this.error = 'Identifiants invalides'
        })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/colors.scss';

#login-page {
  &.hero {
    &.is-login {
      background: $navy;
    }
    & .nav,
    &.is-login .nav {
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
  & .box {
    margin-top: 5rem;
  }
  & .avatar {
    margin-top: -70px;
    padding-bottom: 20px;
    & img {
      padding: 5px;
      background: #fff;
      border-radius: 50%;
      -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.1);
      box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.1);
    }
  }
  & input {
    font-weight: 300;
    &.input {
      border: none !important;
      box-shadow: none !important;
    }
  }
  & p {
    font-weight: 700;
    &.subtitle {
      padding-top: 1rem;
    }
  }
}
</style>
