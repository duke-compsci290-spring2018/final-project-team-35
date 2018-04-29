<template>
  <div id='final-forum'>
    <div id='forum-search'>
      <input v-model='searchFor'>
    </div>
    <div id='forum-header'>
      <button class='blue-button' v-on:click='update("updated_at")'> Latest </button>
      <button class='blue-button' v-on:click='update("likes")'> Likes </button>
      <button class='blue-button' v-on:click='update("views")'> Views </button>
      <button class='blue-button' v-on:click='addPost'> New Post </button>
    </div>
    <div id='forum-posts'>
      <div class='forum-post' v-for='post in postsInThisPage'> 
        <div class='grey-block' v-on:click='$router.push("/forum/view_post/"+post.key)'>
          <p> title: {{post.title}} </p>
          <p> likes: {{post.likes}} </p>
          <p> views: {{post.views}} </p>
        </div>
      </div>
      <button class='blue-button' v-on:click='page = page-1' v-if='page > 1'> prev </button>
      <button class='blue-button' v-on:click='page = page+1' v-if='page < maxPage'> next </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {db} from '../firebase.js'

export default {
  name: 'final-forum',
  computed: {
    postsInThisPage: function() {
      var ret = []
      var startingIdx = (this.page-1)*this.limit
      for(var idx = startingIdx ; idx < Math.min(startingIdx+this.limit, this.posts.length) ; idx ++)
	ret.push(this.posts[idx])
      return ret
    },
    maxPage: function() {
      return Math.floor((this.posts.length-1)/this.limit)+1
    }
  },
  data() {
    return {
      searchFor: '',
      page: 1,
      limit: 5,
      posts: []
    }
  },
  methods: {
    update: function(criteria) {
      Vue.set(this, 'posts', [])
      db.ref('/posts')
	.orderByChild(criteria)
	.once('value').then( data => {
	  data.forEach(d => { 
	    if(d.val().visible) { 
	      var that = d.val()
	      that['key'] = d.key
	      this.posts.push(that)
	    }
	  })
	  this.posts = this.posts.reverse()
	})
    },
    addPost: function() {
      this.$router.push({
	name: 'post-editor',
	params: {
	  postInfo: {
	    title: '',
	    html: '',
	    author_uuid: this.uuid
	  }
	}
      })
    }
  },
  beforeMount() {
    this.update('updated_at')
  }
}
</script>


<style scoped>
    #final-forum {
        padding: 4%;
        margin: 4%;
        background-color: #fff;
        
    }
    
    button {
        width: 15%;
        color: #fff;
        margin: 3%;
        background: black;
    }
    
    
    
    
</style>
