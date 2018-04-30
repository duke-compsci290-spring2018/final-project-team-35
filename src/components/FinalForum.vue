<template>
  <div id='final-forum'>
    <ul class='list-group'>
      <li class='list-group-item'>
        <ul id='forum-header' class='list-inline list-group'>
          <li class='topCtrl' >
            <button class='ctrls list-inline-item list-group-item' v-on:click='update("updated_at")'> Latest </button>
          </li>
          <li class='topCtrl'>
            <button class='ctrls list-inline-item list-group-item' v-on:click='update("numLikes")'> Likes </button>
          </li>
          <li class='topCtrl'>
            <button class='ctrls list-inline-item list-group-item' v-on:click='update("numViews")'> Views </button>
          </li>    
          <li class='topCtrl'>
            <button class='ctrls list-inline-item list-group-item' v-on:click='update("numComments")'> HOT </button>
          </li>
          <li class='topCtrl'>
            <button id="upload" class='ctrls list-inline-item list-group-item' v-on:click='addPost' v-if='loggedIn'> New Post </button>
          </li>
        </ul>
      </li>
      <li class='list-group-item'>
        <ul id='forum-posts' class='list-group'>
          <li class='forum-post list-group-item' v-for='(post, idx) in postsInThisPage' v-if='post.visible'> 
            <div class='grey-block' v-on:click='$router.push("/forum/view_post/"+post.key)'>
              <span v-on:click.stop='deletePost(idx)' v-if='currentUserRole === "admin" || currentUserUUID === post.author_uuid'> 
                    <i id= 'ban' class='fa fa-times'></i>
              </span>
              <h3> {{post.title}} </h3> 
              <h5>posted by {{post.author_name}}</h5> 
              <div class='icons'>
                <span> {{post.likes === undefined ? 0 : post.likes.length }} <i class="fa fa-heart"></i>&nbsp;&nbsp; </span>
                <span> {{post.views === undefined ? 0 : post.views.length }}  <i class="fa fa-search"></i>&nbsp;&nbsp; </span>
                <span> {{post.comments === undefined ? 0 : post.comments.length }}  <i   class="fa fa-comments"></i></span>
              </div>
            </div>
            
          </li>
          <li class='list-group-item'>
            <div id="position">
              <button class='blue-button ctrls' v-on:click='page = page-1' v-if='page > 1'> prev </button>
              <button class='blue-button ctrls' v-on:click='page = page+1' v-if='page < maxPage'> next </button>
            </div>
          </li>
        </ul>
      </li>
    </ul>
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
        limit: 4,
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
    min-height: 100%;
    font-family: 'Roboto Slab', serif;
  }
  
  #next {
    cursor: pointer;
  }
  
  #ban:hover {
    color: grey;
  }
  
  h3 {
    margin-top: 1%;
  }
  
  #ban {
    float: right;
    font-size: 18px;
  }
  
  #upload {
    background: mediumvioletred;
  }
  
  button {
    width: 15%;
    color: #fff;
    margin: 3%;
    background: black;
  }

  #forum-posts {
    padding: 0; 
  }
  
  button:hover {
    background: azure;
    color: black;
  }
  
  .forum-post {
    background: #fff;
  }

  .list-inline {
    display: flex;
    justify-content: space-around;
  }
  
  .list-inline-item {
    width: 100%;
    text-align: center;
  }
  
  #position {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  
  #forum-header {
    margin-bottom: 0;
  }
  
  ul {
    list-style: none;
  }
  
  .topCtrl {
    width: 19%;
    padding: 0.5%;
    padding-bottom: 3%;
  }
  
  .topCtrl button {
    margin: 0;
    padding: 0;
  }
  
  .ctrls {
    margin-top: 1%;
    margin-bottom: 1%;
    height: 200%;
  }
  
  i {
    color: firebrick;
  }

  footer {
    text-align: center;
    padding: 2%;
  }
  
  #icons {
    display: inline-block;
  }
  
</style>
