<template lang="pug">
  section.section
    .container
      .box
        .level
          .level-left
            .level-item
              nuxt-link(to="/login") Login
          .level-item.has-text-centered
            button.button.is-primary.is-fluid(@click.stop="reload", :class="{'is-loading': isFindPending}") Reload
          .level-right(v-if="payload")
            .level-item
              a(@click.stop="logoot") Logout ({{ user.email }})

      transition(name="fade")
        .columns.is-multiline(v-if="secrets[0]")
          .column.is-4(v-for="secret in secrets", :key="secret._id")
            .box.is-fullheight
              .content
                span.tag.is-primary(v-if="secret.userId") My personal secret
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
    reload() {
      const q = this.user
        ? {
            userId: this.user._id
          }
        : {}
      this.findSecrets({ query: q }).then(res => {
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
