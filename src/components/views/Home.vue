<template>
  <md-layout class="Home">
    <post-list v-if="posts.length" :posts="posts" />
    <md-layout v-if="!posts.length" style="text-align: center">
      <md-layout md-flex="25"></md-layout>
      <md-layout md-flex="50">
        <md-icon class="md-size-4x">sentiment_dissatisfied</md-icon>
      </md-layout>
      <md-layout md-flex="25"></md-layout>
      <md-layout md-flex="25"></md-layout>
      <md-layout md-flex="50" class="md-display-2">
        <span>
          Oh dear, looks like there's nothing here!
          <br />
          <md-button md-align="center" class="md-button md-raised md-primary">
            <md-icon>add</md-icon> Add Friends
          </md-button>
          <md-button md-align="center" class="md-button md-raised md-primary" @click.native="togglePublic(!public)">
            <md-icon>{{toggleButtonIcon}}</md-icon> {{toggleButtonLabel}} Events
          </md-button>
        </span>
      </md-layout>
      <md-layout md-flex="25"></md-layout>
    </md-layout>
    <event-form />
    <md-bottom-bar class="bottom-bar">
      <md-bottom-bar-item md-icon="people" :md-active="!public" @click.native="togglePublic(false)">
        Friends
      </md-bottom-bar-item>
      <md-bottom-bar-item md-icon="public" :md-active="public" @click.native="togglePublic(true)">Public</md-bottom-bar-item>
    </md-bottom-bar>
  </md-layout>
</template>

<script>
import helpers from '@/lib/FirebaseHelpers'
import PostList from '@/components/postList/postList'
import eventForm from '@/components/views/createEvent.vue'

export default {
  name: 'home',
  data () {
    return {
      posts: [],
      public: false
    }
  },
  computed: {
    toggleButtonIcon () {
      return this.public ? 'people' : 'public'
    },
    toggleButtonLabel () {
      return this.public ? 'Friends\'' : 'Public'
    }
  },
  created () {
    helpers.getFriendPosts().then(posts => {
      this.posts = posts
    })
  },
  methods: {
    togglePublic (pub) {
      this.public = pub !== null ? pub : !this.public
      if (this.public) {
        helpers.getPublicPosts().then(posts => {
          this.posts = posts
        })
      } else {
        helpers.getFriendPosts().then(posts => {
          this.posts = posts
        })
      }
    }
  },
  components: {PostList, eventForm}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
