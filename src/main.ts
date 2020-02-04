import Vue from 'vue'

import './registerServiceWorker'

import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

import './bootstrap'

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

const setVH = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', vh + 'px')
}

setVH()
window.addEventListener('resize', setVH)
