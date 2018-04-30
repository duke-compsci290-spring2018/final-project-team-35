<template>
  <div id='app'>
    <nav class='navbar navbar-inverse'>
      <div class='container-fluid'>
        <div class='navbar-header'>
	  <router-link class='navbar-brand' to='/'>Tour<i class='fa fa-at'></i>Duke</router-link>
        </div>
        <ul class='nav navbar-nav'>
            <li><router-link to='/'><i class='fa fa-home' aria-hidden='true'></i> Home</router-link></li>
	    <li><router-link to='/places'><i class='fa fa-map-signs'></i> Places</router-link></li>
            <li><router-link to='/forum'><i class='fa fa-comments'></i> Forum</router-link></li>
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
  export default {
    mounted: function() {
      firebase.auth().onAuthStateChanged( this.userChangeHandler )  
    },
    data() {
      return {
        user: undefined, 
        uuid : ""
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
            // 1. verify that user is not in the database
            if(user) {}
            // 2. push the user information into the database
        }      
      },
      signOut: function() {
        firebase.auth().signOut()
      }
    }
  }
  </script>

  <style>
    html, body {
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
      height: 100%;
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