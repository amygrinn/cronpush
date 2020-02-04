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
