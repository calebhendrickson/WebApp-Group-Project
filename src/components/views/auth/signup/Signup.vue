<template>
  <md-layout class="signup" md-gutter>
    <md-layout>
      <span class="md-display-2">Signup</span>
    </md-layout>
    <md-input-container :class="{'md-input-invalid': invalidUsername}">
      <label>Username</label>
      <md-input type="text" v-model="username"></md-input>
      <span class="md-error">{{ usernameError }}</span>
    </md-input-container>
    <md-input-container :class="{'md-input-invalid': invalidEmail}">
      <label>Email</label>
      <md-input type="email" v-model="email"></md-input>
      <span class="md-error">{{ emailError }}</span>
    </md-input-container>
    <md-input-container md-has-password :class="{'md-input-invalid': invalidPassword}">
      <label>Password</label>
      <md-input type="password" v-model="password"></md-input>
      <span class="md-error">{{ passwordError }}</span>
    </md-input-container>
    <md-input-container :class="{'md-input-invalid': invalidConfirmPassword}" md-has-password>
      <label>Confirm Password</label>
      <md-input type="password" v-model="confirmationPassword" v-on:input="validateConfirmPassword"></md-input>
      <span class="md-error">Passwords must match</span>
    </md-input-container>
    <md-layout md-gutter md-align="end" md-flex="100">
      <md-button class="md-raised md-primary" @click.native="signup()">Signup</md-button>
    </md-layout>
    <md-layout md-align="end" md-flex="100">
      <span>Already have an account? <router-link to="Login">Login</router-link></span>
    </md-layout>
  </md-layout>
</template>

<script>
import firebase from '@/firebase'
import fbHelpers from '@/lib/FirebaseHelpers'

const USERNAME_MIN_LENGTH = 4
const USERNAME_MAX_LENGTH = 20

const USERNAME_EXISTS = 'A user with that name already exists'
const USERNAME_TOO_LONG = 'Username must not be longer than ' + USERNAME_MAX_LENGTH + ' characters'
const USERNAME_TOO_SHORT = 'Username must not be shorter than ' + USERNAME_MIN_LENGTH + ' characters'
const USERNAME_REQUIRED = 'Username is required'

const emailErrorMessages = {
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/email-already-in-use': 'That email adress is already in use'
}
const passwordErrorMessages = {
  'auth/weak-password': 'Password must be longer than 6 characters'
}

const usernameValidators = [
  function (username) {
    if (username.length <= 0) return USERNAME_REQUIRED
  },
  function (username) {
    if (username.length < USERNAME_MIN_LENGTH) return USERNAME_TOO_SHORT
  },
  function (username) {
    if (username.length > USERNAME_MAX_LENGTH) return USERNAME_TOO_LONG
  }
]

export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      password: '',
      username: '',
      confirmationPassword: '',
      invalidEmail: false,
      emailError: '',
      invalidPassword: false,
      passwordError: '',
      invalidUsername: false,
      usernameError: '',
      invalidConfirmPassword: false
    }
  },
  methods: {
    signup () {
      if (this.validateConfirmPassword()) {
        return
      }
      this.validateUsername(() => {
        if (this.invalidUsername) {
          return
        }
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
          // this function returns a promise so we could check for errors, however, the app is
          // auto redirected if an user is authenticated, which is true if we have entered this
          // function, so we cannot do much at the moment
          fbHelpers.createUser(user.uid, this.username)
        }).catch((error) => {
          this.invalidEmail = (this.emailError = emailErrorMessages[error.code]) != null
          this.invalidPassword = (this.passwordError = passwordErrorMessages[error.code]) != null
        })
      })
    },
    validateUsername (callback) {
      this.usernameError = ''
      this.invalidUsername = false

      for (var i = 0; i < usernameValidators.length; i++) {
        var error = null
        if ((error = usernameValidators[i](this.username)) != null) {
          this.invalidUsername = true
          this.usernameError = error
          return callback()
        }
      }
      firebase.database().ref('usernames/' + this.username).once('value').then(this.checkUsernameDatabase(callback))
    },
    checkUsernameDatabase (callback) {
      return (snapshot) => {
        this.usernameError = USERNAME_EXISTS
        this.invalidUsername = snapshot.val() !== null
        return callback()
      }
    },
    validateConfirmPassword () {
      return (this.invalidConfirmPassword = this.password !== this.confirmationPassword)
    }
  }
}
</script>
