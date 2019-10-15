<template>
  <md-layout md-align="center" class="user" md-gutter>
    <md-layout md-flex="50" md-gutter>
      <router-view v-bind:user="user"></router-view>
    </md-layout>
  </md-layout>
</template>

<script>
import firebase from '@/firebase'
const database = firebase.database()

let id = null

// gaurds against navigation to a route without a valid user
const guard = function (to, from, next) {
  database.ref('usernames/' + to.params.name).once('value').then(function (snapshot) {
    if (snapshot.val() === null) {
      next('/') // redirects to the root of the app for now, should probs go to a 'user not found' page
    }
    id = snapshot.val()
    next() // need to be sure to call next() to allow the route to proceed
  })
}

export default {
  name: 'user',
  props: ['name'],
  data () {
    return {
    }
  },
  firebase () {
    return {
      // initially binds user to the database entry, uses vuefire
      user: {
        source: database.ref('users/' + id),
        asObject: true
      }
    }
  },
  watch: {
    // this hook is called whenever the route changes but remains on the same component
    // e.g. from users/foo to users/bar, the data needs to be rebound to the new user
    '$route': function () {
      this.$bindAsObject('user', database.ref('users/' + id))
    }
  },
  // these two hooks are called whenever we navigate to this route, and simply call the
  // guard function above
  beforeRouteEnter: guard,
  beforeRouteUpdate: guard
}
</script>
