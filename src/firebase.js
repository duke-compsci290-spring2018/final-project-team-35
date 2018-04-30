import Vue from 'vue';
import * as firebaseui from 'firebaseui';

const config = {
  apiKey: "AIzaSyDSrlbhDKTzAjtp9OkKnuuNO3gm17D5HUI",
  authDomain: "final-project-1c0a8.firebaseapp.com",
  databaseURL: "https://final-project-1c0a8.firebaseio.com",
  projectId: "final-project-1c0a8",
  storageBucket: "final-project-1c0a8.appspot.com",
  messagingSenderId: "137642663660"
};

export const firebase = require('firebase');
export const db = firebase.initializeApp(config).database();

export const uiConfig = {
  signInSuccessUrl: '#',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

export const ui = new firebaseui.auth.AuthUI(firebase.auth());