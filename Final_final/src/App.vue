<template>
  <div id='app' v-bind:style='{ backgroundImage: "url("+bgUrl+")" }'>
    <nav class='navbar navbar-inverse'>
      <div class='container-fluid'>
        <div class='navbar-header'>
	  <router-link class='navbar-brand' to='/'>Tour<i class='fa fa-at'></i>Duke</router-link>
        </div>
        <ul class='nav navbar-nav'>
            <li><router-link to='/final-project-team-35/'><i class='fa fa-home' aria-hidden='true'></i> Home</router-link></li>
	    <li><router-link to='/final-project-team-35/places'><i class='fa fa-map-signs'></i> Places</router-link></li>
            <li><router-link to='/final-project-team-35/forum'><i class='fa fa-comments'></i> Forum</router-link></li>
        </ul>
        <ul class='nav navbar-nav navbar-right'>
	  <li v-if='!loggedIn'><a href='#'> Guest <i class="fa fa-user-secret"></i> </a></li>
	  <li v-if='loggedIn'><a href='#'> {{ user.displayName }} <i class="fa fa-user-circle"></i> </a></li>
	  <li v-if='loggedIn'><a href='#' v-on:click='signOut'> Sign out </a></li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import {firebase} from './firebase.js'


const bgUrls = ['./src/assets/Duke_01.png', './src/assets/Duke_02.jpeg', './src/assets/Duke_03.jpg',
		'./src/assets/Duke_04.jpg', './src/assets/Duke_05.jpg', './src/assets/Duke_06.jpg']

export default {
  created() {
    this.bgUrl = bgUrls[Math.floor(Math.random() * (bgUrls.length-1))]
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged( this.userChangeHandler )  
  },
  data() {
    return {
      user: undefined,
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
    },
    signOut: function() {
      firebase.auth().signOut()
    }
  }
}
</script>

<style>
html {
    margin: 0;
    padding: 0;
    height: 100%;
}

#app {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
  width: 100%;
  min-height: 100vh;
}

.navbar {
  margin-bottom: 0px;
  border-radius: 0px;
}

button {
    color: black;
    border: 0px;
    border-radius: 4px;
    margin-left: 10px;
    margin-right: 10px;
}

button:hover{
    color: #888;
}
</style>
