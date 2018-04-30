<template>
  <div id='final-forum'>
    <div id='forum-header'>
      <button class='blue-button' v-on:click='update("updated_at")'> Latest </button>
      <button class='blue-button' v-on:click='update("numLikes")'> Likes </button>
      <button class='blue-button' v-on:click='update("numViews")'> Views </button>
      <button class='blue-button' v-on:click='update("numComments")'> HOT </button>
      <button class='blue-button' v-on:click='addPost' v-if='loggedIn'> New Post </button>
    </div>
    <div id='forum-posts'>
      <div class='forum-post' v-for='(post, idx) in postsInThisPage' v-if='post.visible'> 
        <div class='grey-block' v-on:click='$router.push("/forum/view_post/"+post.key)'>
          <h3> {{post.title}} </h3>
	  <span v-on:click.stop='deletePost(idx)' v-if='currentUserRole === "admin" || currentUserUUID === post.author_uuid'> 
	        <i class='fa fa-ban'></i>
	  </span>
          <p> {{post.likes === undefined ? 0 : post.likes.length }}  <i class="fa fa-heart"></i> <p>
          <p> {{post.views === undefined ? 0 : post.views.length }}  <i class="fa fa-search"></i></p>
          <p> {{post.comments === undefined ? 0 : post.comments.length }}  <i class="fa fa-comments"></i></p>
        </div>

      </div>
      <div id="position">
        <button class='blue-button' v-on:click='page = page-1' v-if='page > 1'> prev </button>
        <button class='blue-button' id = 'next' v-on:click='page = page+1' v-if='page < maxPage'> next </button>
      </div>
    </div>
      <footer><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</footer>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {db, firebase} from '../firebase.js'

  export default {
    name: 'final-forum',
    mounted() {
      firebase.auth().onAuthStateChanged( this.userChangeHandler )      
    },
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
      },
      authorName: function() {
          // user.displayName <- google api <- author_uuid 
      }
    },
    data() {
      return {
        searchFor: '',
        page: 1,
        limit: 5,
        posts: [],
        loggedIn: false,
	currentUserUUID: '',
	currentUserRole: ''
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
      },
      deletePost: function(idx) {
	Vue.set(this.posts[idx], 'visible', false);
	db.ref('/posts/'+this.posts[idx].key).set(this.posts[idx]);
      },
      userChangeHandler: function(user) {
        this.loggedIn = user != null
	this.currentUserUUID = user ? user.uid : '';
	if(user) {
	  db.ref('/users/'+this.currentUserUUID+'/role').once('value').then(data => {
	    Vue.set(this, 'currentUserRole', data.val()); 
	  })
	} else {
	  Vue.set(this, 'currentUserRole', 'guest');
	}
      }
    },
    beforeMount() {
      this.update('updated_at')
    }
  }
</script>


<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab'); 
  
  #final-forum {
    padding: 4%;
    background: #a9a9a9;
    min-height: 100%;
    font-family: 'Roboto Slab', serif;
  }
  
  #next {
    float: right;
  }
  
  button {
    width: 15%;
    color: #fff;
    margin: 3%;
    background: black;
  }

  button:hover {
    background: azure;
    color: black;
  }
  
  .forum-post {
    margin: 2%;
    padding: 1%;
    background: #fff;
  }

  p {
    text-align: right;
  }

  i {
    color: firebrick;
  }

  footer {
    text-align: center;
    padding: 2%;
  }
    
</style>
