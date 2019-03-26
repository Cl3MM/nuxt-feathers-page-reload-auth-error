<template lang="pug">
  nuxt
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted() {
    this.authenticate().catch(_ => {})
  },
  methods: {
    ...mapActions('auth', ['authenticate'])
  }
}
</script>
