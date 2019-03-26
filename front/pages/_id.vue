<template lang="pug">
  section.section
    .container
      .box
        .level
          .level-left
            .level-item
              nuxt-link.button.is-light(to="/") Home
          .level-right(v-if="user")
            .level-item
              a.button.is-light(@click.stop="logoot") Logout ({{ user.email }})
      pre {{ user }}
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  // eslint-disable-next-line vue/require-prop-types
  data: () => ({ id: null, user: null }),
  computed: {
    ...mapState('auth', ['isAuthenticatePending', 'payload', 'user'])
  },
  mounted() {
    this.id = this.$route.params.id

    const { User } = this.$FeathersVuex

    let user = User.getFromStore(this.id)

    if (!user) {
      user = User.getFromStore(this.id)
      return this.get(this.id).then(user => {
        this.user = user.clone()
      })
    }
    this.user = user.clone()
  },
  methods: {
    ...mapActions('users', ['get']),
    ...mapActions('auth', ['authenticate', 'logout']),
    ...mapActions('secrets', { findSecrets: 'find' }),
    logoot() {
      console.log('login out....')
      this.logout().then(_ => {
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.box {
  display: flex;
  flex-direction: column;
  &.is-fullheight {
    height: 100%;
  }
}
</style>
