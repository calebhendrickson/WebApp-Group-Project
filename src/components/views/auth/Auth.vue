<template>
  <md-layout md-gutter md-align="center" class="auth">
    <md-layout md-flex="50" md-gutter>
      <router-view></router-view>
    </md-layout>
  </md-layout>
</template>

<script>

export default {
  name: 'auth'
}
</script>

<style lang="scss">
.auth {
}
</style>
