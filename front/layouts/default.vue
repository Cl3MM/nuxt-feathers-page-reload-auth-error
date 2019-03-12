<template lang="pug">
  nuxt
</template>

<script>
import { mapActions } from 'vuex'

export default {
  created() {
    if (process.browser) {
      this.authenticate().catch(_ => {})
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate'])
  }
}
</script>
