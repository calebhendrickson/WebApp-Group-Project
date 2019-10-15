<template>
  <div id="app">
    <md-whiteframe>
      <md-toolbar>
        <md-layout style="flex: 1">
          <router-link class="md-button md-title" to="/">
            CyVents
          </router-link>
        </md-layout>
        <md-menu md-align-trigger md-direction="bottom left">
          <md-button md-menu-trigger class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item @click.native="profile()">
              Profile
            </md-menu-item>
            <md-menu-item @click.native="edit()">
              Settings
            </md-menu-item>

            <md-menu-item @click.native="logout()">
              Log out
            </md-menu-item>

          </md-menu-content>
        </md-menu>
      </md-toolbar>
    </md-whiteframe>
    <md-layout md-gutter>
      <router-view></router-view>
    </md-layout>
  </div>
</template>

<script>

import firebase from '@/firebase'
import fbHelpers from '@/lib/FirebaseHelpers'

export default {
  name: 'app',
  data () {
    return {
      profileRoute: ''
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
      })
    },
    profile () {
      this.$router.push(this.profileRoute)
    },
    edit () {
      this.$router.push(this.profileRoute + '/settings')
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        fbHelpers.getAuthedUserRef(user.uid).once('value').then((snapshot) => {
          this.profileRoute = '/user/' + snapshot.val().username
        })
        this.$router.replace('/')
      } else {
        this.$router.replace('/auth/login')
      }
    })
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  > .md-layout {
    margin-top: 1em;
  }
  .md-gutter {
    margin: 16px;
  }
}
</style>
