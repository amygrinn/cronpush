import Vue from 'vue'
import Vuex from 'vuex'

import http from './http'
import authModule from './auth'
import pushModule from './push'
import schedulesModule from './schedules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth: authModule,
    push: pushModule,
    schedules: schedulesModule,
  },
})

http.interceptors.request.use(config => {
  const token = store.getters['auth/token']
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

store.dispatch('init')

export default store
