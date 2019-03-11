<template lang="pug">
  section.section
    .container
      .box
        .level
          .level-left
            .level-item
              nuxt-link(to="/connexion") Login
          .level-right(v-if="payload")
            .level-item
              a(@click.stop="logoot") Logout ({{ user.email }})

      transition(name="fade")
        .columns.is-multiline(v-if="secrets[0]")
          .column.is-4(v-for="secret in secrets", :key="secret._id")
            .box.is-fullheight
              .content
                span.tag(v-if="secret.userId") My secret
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
    // ...mapState('secrets', ['isFindPending']),
    ...mapGetters('secrets', {
      findSecretsInStore: 'find'
      // secrets: 'list'
    }),
    secretsParams() {
      if (this.user) {
        return { query: {} }
      }
      return { query: {} }
    }
    // secrets() {
    //   return this.findSecretsInStore(this.secretsParams).data
    // }
  },
  watch: {
    user: function(val) {
      console.log('finding secrets....')
      this.findSecrets().then(res => {
        console.log('secrets fetched from server')
        console.log(res)
        this.secrets = res.data || []
      })
    }
  },
  mounted() {
    console.log('MOUNTING the mountain')
    this.findSecrets().then(res => {
      this.secrets = res.data || []
    })
  },
  methods: {
    ...mapActions('auth', ['authenticate', 'logout']),
    ...mapActions('secrets', { findSecrets: 'find' }),
    logoot() {
      console.log('login out....')
      this.logout().then(_ => {
        this.$router.push('/?prout')
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
