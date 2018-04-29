import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import MainPage from './components/MainPage.vue'
import PlacePage from './components/PlacePage.vue'
import FinalForum from './components/FinalForum.vue'
import PostEditor from './components/PostEditor.vue'
import PostViewer from './components/PostViewer.vue'
Vue.use(VueRouter);

const NotFoundComponent = { template: '<div> <h1> Page Not Found </h1> </div>' }

const router = new VueRouter({ 
  mode: 'history',
  routes: [
    { path: '/final-project-team-35/Final_final', component: MainPage },
    { path: '/final-project-team-35/Final_final/places', component: PlacePage },
    { path: '/final-project-team-35/Final_final/forum', component: FinalForum },
    { path: '/final-project-team-35/Final_final/forum/edit_post', name: 'post-editor', component: PostEditor, props: true },
    { path: '/final-project-team-35/Final_final/forum/view_post/:postKey', component: PostViewer },
    { path: '/final-project-team-35/Final_final/*', component: MainPage }
  ]
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
