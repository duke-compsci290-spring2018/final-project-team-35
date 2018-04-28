<template>
  <div id='post-viewer'>
    <div id='post-viewer-sidebar'> 
      <p> {{ postInfo.author_uuid }}</p>
    </div>
    <div id='post-viwer-contents'>
      <div id='post-viewer-title'>
	<h1> {{ postInfo.title }}</h1>
	<p> {{ postInfo.likes.length }} </p>
	<button v-on:click='like' v-bind:disabled='alreadyLiked'> LIKE </button>
      </div>
      <div id='post-viewer-body' v-html='postInfo.html'>
      </div>
      <div id='post-viewer-comments'>
	<div class='grey-block' v-for='comment in postInfo.comments'>
	  {{ comment.author_uuid }} : {{ comment.contents }} : {{ comment.created_at }}
	</div>
	<div class='grey-block'>
	  <input v-model='newComment' v-on:keydown.enter='addComment'>
	</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {db} from '../firebase.js'

export default {
  name: 'post-viewer',
  created() {
    db.ref('/posts/'+this.$route.params.postKey)
      .once('value').then( data => {
	data.forEach( d => {
	  Vue.set(this.postInfo, d.key, d.val())
	})
	if(this.postInfo.length === 0)
	  this.$router.replace('/')
	if(this.postInfo['comments'] === undefined)
	  Vue.set(this.postInfo, 'comments', [])
	if(this.postInfo['likes'] === undefined)
	  Vue.set(this.postInfo, 'likes', [])
    })
  },
  data() {
    return { 
      postInfo: {},
      newComment: ''
    }
  },
  methods: {
    addComment: function() {
      this.postInfo.comments.push({
	author_uuid: 0,
	contents: this.newComment,
	created_at: Math.floor(Date.now() / 1000)
      })
      db.ref('/posts/'+this.$route.params.postKey+'/comments').set(this.postInfo.comments)
      this.newComment = ''
    },
    like: function() {
      db.ref('/posts/'+this.$route.params.postKey+'/likes').transaction( clicks => { return clicks + 1 })
    },
    alreadyLiked: function() {
      return true // (uuid in postInfo.likes)
    }
  }
}
</script>

<style>
</style>

