import { Module } from 'vuex'
import http from '../http'
import getPushSubscription from './get-push-subscription'

interface PushModule {
  enabled: boolean
  endpoint: string
  timeZone: string
}

const pushModule: Module<PushModule, any> = {
  namespaced: true,
  state: {
    enabled: false,
    endpoint: '',
    timeZone: '',
  },
  getters: {
    enabled(state) {
      return state.enabled
    },
    endpoint(state) {
      return state.endpoint
    },
    timeZone(state) {
      return state.timeZone
    },
  },
  mutations: {
    setSubscription(state, subscription: PushModule) {
      state.enabled = subscription.enabled
      state.endpoint = subscription.endpoint
      state.timeZone = subscription.timeZone
    },
    disable(state) {
      state.enabled = false
    },
  },
  actions: {
    init: {
      root: true,
      async handler({ commit, dispatch }) {
        try {
          await navigator.serviceWorker.ready
          const subscription = await getPushSubscription(false)
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

          if (!subscription) {
            commit('disable')
          } else {
            const result = await http.patch('/push', {
              endpoint: subscription.endpoint,
              timeZone,
            })

            commit('setSubscription', result.data)
            dispatch('schedules/refresh', null, { root: true })
          }
        } catch {
          commit('disable')
        }
      },
    },
    async updateSubscription({ commit, dispatch }) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

      try {
        const subscription = await getPushSubscription(true)

        if (subscription) {
          try {
            let result = await http.get('/push', {
              params: { endpoint: subscription.endpoint },
            })
            if (!result.data.enabled) {
              result = await http.patch('/push', {
                endpoint: subscription.endpoint,
                enabled: true,
                timeZone,
              })
            }
            commit('setSubscription', result.data)
          } catch {
            const result = await http.post('/push', {
              ...subscription.toJSON(),
              enabled: true,
              timeZone,
            })
            commit('setSubscription', result.data)
          } finally {
            dispatch('schedules/refresh', null, { root: true })
          }
        } else {
          commit('disable')
        }
      } catch {
        commit('disable')
      }
    },
    async disableSubscription({ state, commit }) {
      if (state.endpoint) {
        const result = await http.patch('/push', {
          endpoint: state.endpoint,
          enabled: false,
        })
        commit('setSubscription', result.data)
      } else {
        commit('disable')
      }
    },
    async sendSubscription({ state, commit }) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

      if (state.endpoint) {
        const result = await http.patch('/push', {
          endpoint: state.endpoint,
          enabled: state.enabled,
          timeZone,
        })
        commit('setSubscription', result.data)
      }
    },
  },
}

export default pushModule
