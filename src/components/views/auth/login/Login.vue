<template>
  <md-layout md-gutter class="login">
    <md-layout>
      <span class="md-display-2">Login</span>
    </md-layout>
    <md-layout md-flex="100">
      <md-input-container :class="{'md-input-invalid': failedLogin}">
        <label>Email</label>
        <md-input type="email" v-model="email"></md-input>
        <span class="md-error">Login failed. Incorrect email or password</span>
      </md-input-container>
      <md-input-container md-has-password>
        <label>Password</label>
        <md-input type="password" v-model="password"></md-input>
      </md-input-container>
    </md-layout>
    <md-layout md-gutter md-align="end" md-flex="100">
      <md-button class="md-raised md-primary" @click.native="login()">Login</md-button>
    </md-layout>
    <md-layout md-gutter md-align="end" md-flex="100">
      <span>Don't have an account? <router-link to="Signup">Signup</router-link></span>
    </md-layout>
  </md-layout>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      failedLogin: false
    }
  },
  methods: {
    login () {
      console.log('Logging in with email: ' + this.email)
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
        this.$router.replace('/')
      }).catch((error) => {
        this.failedLogin = true
        console.log(error)
        firebase.auth().signOut()
      })
    }
  }
}
</script>

<style>
.login {

}
</style>
