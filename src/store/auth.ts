import { Module } from 'vuex'

import http from './http'

interface AuthState {
  user?: {
    id: string
    username: string
    token: string
    createdAt: string
    updatedAt: string
  }
}

const authModule: Module<AuthState, any> = {
  namespaced: true,
  state: {
    user: undefined,
  },
  getters: {
    user: state => state.user,
    token: state => (state.user ? state.user.token : undefined),
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    removeUser(state) {
      state.user = undefined
    },
  },
  actions: {
    async setUser({ commit, dispatch }, user) {
      commit('setUser', user)
      await dispatch('push/sendSubscription', null, { root: true })
      await dispatch('schedules/refresh', null, { root: true })
    },
    init: {
      root: true,
      async handler({ dispatch }) {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const result = await http.get('/auth/verify', {
              headers: { Authorization: 'Bearer ' + token },
            })

            dispatch('setUser', { token, ...result.data })
          } catch {
            // noop
          }
        }
      },
    },
    logout({ commit }) {
      localStorage.removeItem('token')
      commit('removeUser')
    },
    async login({ dispatch }, user) {
      try {
        const result = await http.post('/auth/login', user)
        localStorage.setItem('token', result.data.token)
        dispatch('setUser', result.data)
      } catch (err) {
        throw new Error(err.response.data.error)
      }
    },
    async register({ dispatch }, user) {
      try {
        const result = await http.post('/auth/register', user)
        localStorage.setItem('token', result.data.token)
        dispatch('setUser', result.data)
      } catch (err) {
        throw new Error(err.response.data.error)
      }
    },
  },
}

export default authModule
