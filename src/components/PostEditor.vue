<template>
  <div id='post-editor'>
    <h2>New Post</h2>
    <input v-model='postInfo.title' placeholder=" Title:">
    <quill-editor ref='myQuillEditor' v-model.sync='postInfo.html' v-bind:options='editorOption'></quill-editor>
    <button class='blue-button' v-on:click='addPost(); $router.go(-1);'> Submit </button>
    <button class='blue-button' v-on:click='$router.go(-1)'> Cancel </button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueQuillEditor from 'vue-quill-editor'
  import Quill from 'quill';
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import ImageResize from 'quill-image-resize-module';
  import {db, firebase} from '../firebase.js'
  
  Quill.register('modules/imageResize', ImageResize);
  Vue.use(VueQuillEditor)
  
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }, 'image'],
  
    ['clean']                                         // remove formatting button
  ];

  export default {
    name: 'post-editor',
    mounted() {
      firebase.auth().onAuthStateChanged( this.userChangeHandler )
    },
    created() {
      this.postInfo = this.$route.params.postInfo
    },
    data() {
      return { 
        postInfo: {},
        editorOption: {
          modules: {
            imageResize: {},
            toolbar: toolbarOptions
          }
        },
	currentUserUUID: '',
	currentUserName: '',
	currentUserRole: ''
      }
    },
    methods: {
      addPost: function() {
        var pi = this.postInfo

        var curTime = Math.floor(Date.now() / 1000) 
        if(pi['created_at'] === undefined)
        pi['created_at'] = curTime
        pi['updated_at'] = curTime
        pi['visible'] = true
        pi['views'] = pi['likes'] = []
        pi['numViews'] = pi['numLikes'] = pi['numComments'] = 0
        pi['author_uuid'] = this.currentUserUUID
	pi['author_name'] = this.currentUserName
        pi['author_role'] = this.currentUserRole
        pi['comments'] = []

        var ref = null
        if(pi['key'] === undefined) ref = db.ref('/posts').push()
        else ref = db.ref('/posts/'+pi['key'])
        delete pi['key']

        ref.set(pi)
      },
      userChangeHandler: function(user) {
	Vue.set(this, 'currentUserUUID', user ? user.uid : '');
	if(user) {
	  Vue.set(this, 'currentUserName', user.displayName);
	  db.ref('/users/'+this.currentUserUUID+'/role').once('value').then(data => {
	    Vue.set(this, 'currentUserRole', data.val());
	  })
	} else {
	  Vue.set(this, 'currentUserName', 'Guest');
	  Vue.set(this, 'currentUserRole', 'guest');
	}
      }
    }
  }

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab'); 
  
  #post-editor {
    padding: 4%;
    border: solid grey;
    margin-top: 8%;
    margin-left: 17%;
    margin-right: 17%;
    font-family: 'Roboto Slab', serif;
  }

  button {
    width: 15%;
    color: #fff;
    margin-top: 3%;
    background: black;
    margin-left: 40%;

  }

  button:hover {
    background: pink;
    color: black;
  }

  input {
    margin-top: 1%;
    margin-bottom: 2%;
  }

  
</style>