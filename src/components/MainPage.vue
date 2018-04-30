<template>
  <div id='main-page' v-bind:style='{ backgroundImage: "url("+bgUrl+")" }'>
    <div id='beforelogin' v-if='init' v-show='!loggedIn'>
      <div id="license">
        <footer class="footer"><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</footer>
      </div>
    </div>
    <div id='afterlogin' v-if='init' v-show='loggedIn'>
      <h1> <i> Welcome to Duke University! </i> </h1>
  </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {ui, uiConfig, firebase, db} from '../firebase.js'
  import * as firebaseui from 'firebaseui'

  //For Develop
  //const rootDir = '.'
  // FOR PRODUCTION
  const rootDir = '.'

  const bgUrls = [rootDir+'/src/assets/Duke_01.png', rootDir+'/src/assets/Duke_02.jpeg', rootDir+'/src/assets/Duke_03.jpg', rootDir+'/src/assets/Duke_04.jpg', rootDir+'/src/assets/Duke_05.jpg', rootDir+'/src/assets/Duke_06.jpg']

  export default {
    created() {
      this.bgUrl = bgUrls[Math.floor(Math.random() * (bgUrls.length-1))]
      console.log(this.bgUrl)
    },
    mounted() {
      firebase.auth().onAuthStateChanged( this.userChangeHandler )
      Vue.set(this, 'init', true)
    },
    data() {
      return {
        user: undefined,
        init: false,
        bgUrl: ''
      }
    },
    computed: {
      loggedIn: function() {
        return this.user != null
      }
    },
    methods: {
      userChangeHandler: function(user) {
        this.user = user
	if(user) {
	  db.ref('/users/'+this.user.uid)
	    .once('value').then(data => {
	    var cnt = 0;
	    data.forEach(d => { cnt = cnt + 1; } )
	    if(cnt == 0) {
	      db.ref('/users/'+this.user.uid).set({
		name: this.user.displayName,
		role: 'user'
	      })
	    }
	  })
	}
        ui.start('#beforelogin', uiConfig)
	console.log(user)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Cinzel');
  @import url('https://fonts.googleapis.com/css?family=PT+Sans');

  #main-page {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
    width: 100%;
    height: 100%;
  }

  #beforelogin {
    position: relative;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    text-align: center;
    color: black;
    padding: 2% 5%;
    background: rgba(255,255,255,0.4);
    font-family: 'Cinzel', serif;
  }

  #afterlogin {
    position: relative;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    text-align: center;
    color: black;
    padding: 2% 5%;
    background: rgba(255,255,255,0.4);
    font-family: 'Cinzel', serif;
    
  }


  #beforelogin input {
    margin-left: 5px;
    font-family: 'PT Sans', sans-serif;
  }
  
  #license {
    position: absolute;
    bottom: 0;
    font-weight: bold;
  }
  
  #license a {
    font-weight: bolder;
    color: firebrick;
  }
  
</style>
