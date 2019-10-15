<template>
  <md-layout class="user-edit" md-gutter>
    <md-layout>
      <span class="md-display-1">Settings</span>
    </md-layout>
    <md-input-container>
      <label>Bio</label>
      <md-textarea maxlength="250" v-model="editable.bio"></md-textarea>
      <span class="md-error"></span>
    </md-input-container>
    <md-input-container>
      <label>Address</label>
      <md-input type="text" v-model="editable.address"></md-input>
      <span class="md-error"></span>
    </md-input-container>
    <md-input-container>
      <label>Phone</label>
      <md-input type="text" v-model="editable.phone" v-on:input="formatPhone"></md-input>
      <span class="md-error"></span>
    </md-input-container>
    <md-layout md-gutter md-align="end" md-flex="100">
      <md-button class="md-raised md-primary" @click.native="save()">Save</md-button>
    </md-layout>
  </md-layout>
</template>

<script>
import { asYouType as AsYouType } from 'libphonenumber-js'
import firebase from '@/firebase'
import fbHelpers from '@/lib/FirebaseHelpers'

const database = firebase.database()

// guard so that the authenticated user can only access his/her edit page
const guard = function (to, from, next) {
  database.ref('usernames/' + to.params.name).once('value').then(function (snapshot) {
    if (snapshot.val() !== firebase.auth().currentUser.uid) {
      next('/') // redirects to the root of the app for now, should probs go to a 'user not found' page
    }
    next() // need to be sure to call next() to allow the route to proceed
  })
}

export default {
  name: 'user-edit',
  props: ['user'],
  data: function () {
    let editable = {}
    this.setEditableValues(editable)
    return {
      editable: editable
    }
  },
  methods: {
    formatPhone () {
      this.editable.phone = new AsYouType('US').input(this.editable.phone)
    },
    save () {
      fbHelpers.editUser(this.user['.key'], this.editable).then(() => {
        this.$router.push('/user/' + this.user['username'])
      })
    },
    setEditableValues: function (editable) {
      editable.bio = this.user['bio'] ? this.user['bio'] : ''
      editable.address = this.user['address'] ? this.user['address'] : ''
      editable.phone = this.user['phone'] ? this.user['phone'] : ''
    }
  },
  watch: {
    user () {
      this.setEditableValues(this.editable)
    }
  },
  beforeRouteEnter: guard,
  beforeRouteUpdate: guard
}
</script>
