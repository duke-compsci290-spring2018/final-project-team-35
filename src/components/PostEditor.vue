<template>
  <div id='post-editor'>
    <input v-model='postInfo.title' placeholder=" Title:">
    <vue-quill-editor v-model.sync='postInfo.html'></vue-quill-editor>
    <button class='blue-button' v-on:click='addPost(); $router.go(-1);'> Submit </button>
    <button class='blue-button' v-on:click='$router.go(-1)'> Cancel </button>
  </div>
</template>

<script>
  import VueQuillEditor from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {db} from '../firebase.js'

  export default {
    name: 'post-editor',
    components: {
      VueQuillEditor: VueQuillEditor.quillEditor
    },
    created() {
      this.postInfo = this.$route.params.postInfo
    },
    data() {
      return { postInfo: {} }
    },
    methods: {
      addPost: function() {
        var pi = this.postInfo

        var curTime = Math.floor(Date.now() / 1000) 
        if(pi['created_at'] === undefined)
        pi['created_at'] = curTime
        pi['updated_at'] = curTime
        pi['visible'] = true
        pi['views'] = pi['likes'] = 0
        pi['author_uuid'] = 'wfjqwpifj'
        pi['comments'] = []

        var ref = null
        if(pi['key'] === undefined) ref = db.ref('/posts').push()
        else ref = db.ref('/posts/'+pi['key'])
        delete pi['key']

        ref.set(pi)
      }      
    }
  }

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab'); 
  
  #post-editor {
    padding: 4%;
    border: solid grey;
    margin: 4%;
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
