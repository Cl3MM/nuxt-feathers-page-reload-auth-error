<template lang="pug">
  section.section
    .container
      .box
        .level
          .level-left
            .level-item
              nuxt-link.button.is-light(v-if="!user", to="/login") Login
              //- span(v-if="user") &nbsp; | &nbsp;
              nuxt-link.button.is-light(v-if="user", :to="'/' + user._id") Edit User
          .level-item.has-text-centered
            button.button.is-primary.is-fluid(@click.stop="reload", :class="{'is-loading': isFindPending}") Reload from store
          .level-right(v-if="user")
            .level-item
              a.button.is-light(@click.stop="logoot") Logout ({{ user.email }})

      transition(name="fade")
        .columns.is-multiline(v-if="secrets[0]")
          .column.is-4(v-for="secret in rndSecrets", :key="secret._id")
            .box.is-fullheight
              .content
                span.tag.is-primary(v-if="user && secret.userId === user._id") My personal secret
                span.tag.is-warning(v-else) Public secret
                p
                  strong {{ secret.title }}
                p {{ secret.message.slice(0, 160) }} ...
          
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data: () => ({ secrets: [] }),
  computed: {
    ...mapState('auth', ['isAuthenticatePending', 'payload', 'user']),
    ...mapState('secrets', { isFindPending: 'isFindPending' }),
    ...mapGetters('secrets', {
      findSecretsInStore: 'find'
    }),
    secretsParams() {
      if (this.user) {
        return { query: {} }
      }
      return { query: {} }
    },
    rndSecrets() {
      return this.shuffle(this.secrets.slice(0))
    }
  },
  watch: {
    user: function(val) {
      console.log('finding secrets....')
      this.reload()
    }
  },
  mounted() {
    console.log('MOUNTING the mountain')
    this.reload()
  },
  methods: {
    ...mapActions('auth', ['authenticate', 'logout']),
    ...mapActions('secrets', { findSecrets: 'find' }),
    logoot() {
      console.log('login out....')
      this.logout().then(_ => {
        this.$router.push('/')
      })
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    },
    reload() {
      const q = this.user
        ? {
            user: this.user
          }
        : {}
      this.findSecrets(q).then(res => {
        console.log('secrets fetched from server')
        this.secrets = res.data || []
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

.card-footer {
  margin-top: auto;
}
</style>
