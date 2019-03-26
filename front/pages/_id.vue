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
      .form(v-if="user")
        b-field.mt-15(grouped)
          b-field(expanded, label="Name")
            b-input(type='text', placeholder="Name", v-model="user.name", name="name", :value="user.name" )
        button.button.is-primary(@click="updateMeName")
          b-icon(icon="refresh", size="is-small")
          span Update

</template>

<script>
import { mapActions } from 'vuex'

export default {
  // eslint-disable-next-line vue/require-prop-types
  data: () => ({ id: null, user: null }),
  mounted() {
    this.id = this.$route.params.id

    const { User } = this.$FeathersVuex

    User.get(this.id).then(user => {
      return this.get(this.id).then(user => {
        try {
          this.user = user.clone()
        } catch (e) {
          console.error(e)
          this.user = new User(user, { isClone: true })
        }
      })
    })
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
    },
    updateMeName() {
      this.user.commit()
      this.user.save()
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
