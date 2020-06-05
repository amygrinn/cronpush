import Vue from 'vue'
import VueResizeText from 'vue-resize-text'

import './registerServiceWorker'

import App from './App.vue'
import router from './router'
import store from './store'

import './bootstrap'

Vue.config.productionTip = false
Vue.use(VueResizeText)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

const setVH = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', vh + 'px')
}

setVH()
window.addEventListener('resize', setVH)
