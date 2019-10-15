<template>
  <md-layout class="postList">
    <post v-for="post in posts" :key="post.key"
      :title="post.title"
      :description="post.description"
      :datetime="post.datetime"
      :location="post.location"
      :maxMembers="post.maxMembers"
      :author="post.author"
      :timestamp="post.timestamp"
    />
  </md-layout>
</template>

<script>
import Post from './post'

export default {
  name: 'postList',
  props: {
    posts: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {Post}
}
</script>

<style>
.postList {

}
</style>
