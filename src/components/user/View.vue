<template>
	<md-layout class="user-view">
    <md-layout md-gutter md-flex="100">
			<md-layout>
	        <span class="md-display-3">{{ user['username'] }}</span>
	    </md-layout>
		</md-layout>
    <md-layout md-gutter="40px" md-flex="100">
      <md-layout md-flex="10"></md-layout>
      <md-layout md-flex="90">
        <span class="md-headline">{{user['bio']}}</span>
      </md-layout>
      <md-layout md-flex="10"></md-layout>
      <md-layout md-flex="90">
        <span class="md-headline">{{user['address']}}</span>
      </md-layout>
      <md-layout md-flex="10"></md-layout>
      <md-layout md-flex="90">
        <span class="md-headline">{{user['phone']}}</span>
      </md-layout>
		</md-layout>
		<post-list v-if="posts.length" :posts="posts" />
		<md-layout md-flex="100" md-align="center">
			<span class="md-display-1" style="margin-top: 5em">
				This user has no posts
			</span>
		</md-layout>
	</md-layout>
</template>

<script>
import firebase from '@/firebase'
import helpers from '@/lib/FirebaseHelpers'
import PostList from '@/components/postList/postList'

export default {
  name: 'user-view',
  props: ['user'],
  data () {
    return {
      posts: []
    }
  },
  created () {
		firebase.database().ref('usernames/' + this.user['username']).once('value').then(snapshot => {
			helpers.getUserPosts(snapshot.key).then(posts => {
				this.posts = posts
			})
		})
  },
	components: {PostList}
}
</script>
