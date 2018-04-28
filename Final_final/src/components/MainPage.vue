<template>
  <div id='main-page'>
    <div id='beforelogin' v-if='init' v-show='!loggedIn'>
    </div>
    <div id='afterlogin' v-if='init' v-show='loggedIn'>
      <h1> <i> Welcome to Duke University! </i> </h1>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {ui, uiConfig, firebase} from '../firebase.js'
import * as firebaseui from 'firebaseui'

export default {
  mounted() {
    firebase.auth().onAuthStateChanged( this.userChangeHandler )
    Vue.set(this, 'init', true)
  },
  data() {
    return {
      user: undefined,
      init: false
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
      ui.start('#beforelogin', uiConfig)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Cinzel');
@import url('https://fonts.googleapis.com/css?family=PT+Sans');

#beforelogin {
  position: absolute;
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
  position: absolute;
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
</style>
