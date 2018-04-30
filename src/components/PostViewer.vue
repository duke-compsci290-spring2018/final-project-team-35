<template>
  <div id='post-viewer' v-if='loaded'>
    <div id='post-viwer-contents'>
      <div id='post-viewer-title'>
        <h1> {{ postInfo.title }}</h1>
        <div id='post-viewer-sidebar'> 
          <p> Posted by {{ postInfo.author_name }} {{ postInfo.author_role === 'admin' ? '(admin)' : '' }}</p>
        </div>
        <div id='icons'>
          <p> {{ postInfo.likes.length }} <i class="fa fa-heart"></i>&nbsp; &nbsp; <p>
          <p> {{ postInfo.views.length }} <i class="fa fa-search"></i>&nbsp; &nbsp; </p>
          <p> {{ postInfo.comments.length }} <i class="fa fa-comments"></i>&nbsp; </p>
          <button v-on:click='like' v-if='currentUserUUID != "" && canLike'> LIKE <i class="fa fa-heart"></i></button>
          <button v-on:click='unlike' v-if='currentUserUUID != "" && !canLike'> UNLIKE <i class="fa fa-heart"></i></button>
        </div>
      </div>
      <div id='post-viewer-body'>
        <div id='post-viwer-html' v-html='postInfo.html'>
        </div>
      </div>
      <div id='post-viewer-comments'>
        <div class='grey-block' v-if='currentUserUUID != ""'>
	  <p style='display: inline-block;'> {{ currentUserName }}: </p>
          <input v-model='newComment' v-on:keydown.enter='addComment' placeholder="Comment">
        </div>
        <div class='grey-block' v-for='(comment, idx) in postInfo.comments'>
	      <p> {{ comment.author_name }}: {{ comment.contents }} - {{ prettify(comment.created_at) }} 
          <span v-on:click='deleteComment(idx)' 
           v-if='currentUserRole === "admin" || currentUserUUID === comment.author_uuid'> 
            <i id= "banban" class='fa fa-times'></i>
          </span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {firebase, db} from '../firebase.js'
<<<<<<< HEAD

=======
>>>>>>> 37bd6705fbcb2769c9409eae0a3bf97df42a766b
  export default {
    name: 'post-viewer',
    beforeMount() {
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
	  if(this.postInfo['views'] === undefined)
      	    Vue.set(this.postInfo, 'views', [])
	  firebase.auth().onAuthStateChanged( this.userChangeHandler )
      })
    },
    data() {
      return { 
        postInfo: {},
        newComment: '',
        currentUserUUID: '',
        currentUserName: '',
        currentUserRole: '',
        canLike: false,
        loaded: false
      }
    },
    methods: {
      addComment: function() {
        this.postInfo.comments.push({
	  author_name: this.currentUserName.split(' ')[0],
	  author_uuid: this.currentUserUUID,
      	  contents: this.newComment,
      	  created_at: Math.floor(Date.now() / 1000)
        })
        db.ref('/posts/'+this.$route.params.postKey+'/comments').set(this.postInfo.comments);
        db.ref('/posts/'+this.$route.params.postKey+'/numComments').set(this.postInfo.comments.length);
        this.newComment = '';
      },
      deleteComment: function(idx) {
	this.postInfo.comments.splice(idx, 1);
	db.ref('/posts/'+this.$route.params.postKey+'/comments').set(this.postInfo.comments);
	db.ref('/posts/'+this.$route.params.postKey+'/numComments').set(this.postInfo.comments.length);
      },
      like: function() {
	this.postInfo.likes.push(this.currentUserUUID)
	db.ref('/posts/'+this.$route.params.postKey+'/likes').set(this.postInfo.likes)
	db.ref('/posts/'+this.$route.params.postKey+'/numLikes').set(this.postInfo.likes.length)
	Vue.set(this, 'canLike', false)
      },
      unlike: function() {
	this.postInfo.likes.splice(this.postInfo.likes.indexOf(this.currentUserUUID), 1);
	db.ref('/posts/'+this.$route.params.postKey+'/likes').set(this.postInfo.likes)
	Vue.set(this, 'canLike', true)
      },
      userChangeHandler: function(user) {
	this.loaded = true
	if(user) {
	  Vue.set(this, 'currentUserUUID', user.uid);
	  Vue.set(this, 'currentUserName', user.displayName.split(' ')[0]);
	  db.ref('/users/'+this.currentUserUUID+'/role').once('value').then(data => {
	    Vue.set(this, 'currentUserRole', data.val()); 
	  })
	  Vue.set(this, 'canLike', this.postInfo.likes.indexOf(this.currentUserUUID) < 0);
	  if(this.postInfo.views.indexOf(this.currentUserUUID) < 0) {
	    this.postInfo.views.push(this.currentUserUUID);
	    db.ref('/posts/'+this.$route.params.postKey+'/views').set(this.postInfo.views)
	    db.ref('/posts/'+this.$route.params.postKey+'/numViews').set(this.postInfo.views.length)
	  }
	} else {
	  Vue.set(this, 'currentUserUUID', '');
	  Vue.set(this, 'currentUserName', 'Guest');
	  Vue.set(this, 'currentUserRole', 'guest');
	  Vue.set(this, 'canLike', false);
	}
      },
      prettify: function(timestamp) {
	return (new Date(timestamp*1000).toLocaleString())
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab'); 
  
  #post-viewer {
    padding: 4%;
    border: solid black;
    margin: 4%;
    font-family: 'Roboto Slab', serif;
  }
  #post-viewer-comments {
    border-style: ridge;
    padding: 2%;
  }
  #post-viewer-title, #post-viewer-body {
    padding-left: 1%;
    overflow: hidden;
  }
  #post-viewer-title {
    display: inline-block;
  }
  
  i {
    color: firebrick;
  }
  
  
  #icons p {
    display: inline-block;
  }
  
  button {
    width: 80%;
    color: white;
    background: grey;
    cursor: pointer;
    margin-bottom: 5%;
    display: inline-block;
    margin-left: 0;
  }
  button:hover {
    background: white;
    color: indianred;
  }
  input {
    margin-top: 1%;
    margin-bottom: 2%;
  }
  
  
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> 37bd6705fbcb2769c9409eae0a3bf97df42a766b
