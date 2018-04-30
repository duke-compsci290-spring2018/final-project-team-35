import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import MainPage from './components/MainPage.vue'
import PlacePage from './components/PlacePage.vue'
import FinalForum from './components/FinalForum.vue'
import PostEditor from './components/PostEditor.vue'
import PostViewer from './components/PostViewer.vue'
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueRouter);

const NotFoundComponent = { template: '<div> <h1> Page Not Found </h1> </div>' }

// FOR production
// const rootDir = '/final-project-team-35'
const rootDir = ''

const router = new VueRouter({ 
  mode: 'hash',
  routes: [
    { path: rootDir+'/', component: MainPage },
    { path: rootDir+'/places', component: PlacePage },
    { path: rootDir+'/forum', component: FinalForum },
    { path: rootDir+'/forum/edit_post', name: 'post-editor', component: PostEditor, props: true },
    { path: rootDir+'/forum/view_post/:postKey', component: PostViewer },
    { path: '*', component: MainPage }
  ]
});

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyBFZB_0uAerF2GJSXCxssPRPgNNDzSH4ow',
        libraries: "places"
    }
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
