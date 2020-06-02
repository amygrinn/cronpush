import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './pages/Main.vue'
import About from './pages/About.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Main },
    { path: '/about', component: About },
  ],
  mode: 'history',
})

export default router
