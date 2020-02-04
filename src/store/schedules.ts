import { Module } from 'vuex'

import http from './http'

export interface Schedule {
  id: string
  title: string
  message: string
  icon: string
  cronExpression: string
  enabled: boolean
}

interface SchedulesModule {
  schedules: Schedule[]
}

const schedulesModule: Module<SchedulesModule, any> = {
  namespaced: true,
  state: {
    schedules: [],
  },
  getters: {
    schedules(state) {
      return state.schedules
    },
  },
  mutations: {
    setSchedules(state, schedules: Schedule[]) {
      state.schedules = schedules.sort((a, b) => +b.enabled - +a.enabled)
    },
  },
  actions: {
    async refresh({ commit, rootGetters }) {
      const endpoint = rootGetters['push/endpoint']
      if (endpoint) {
        const result = await http.get('/schedules', { params: { endpoint } })
        commit('setSchedules', result.data.schedules)
      } else {
        commit('setSchedules', [])
      }
    },
    async create(
      { commit, rootGetters, getters },
      schedule: Partial<Schedule>
    ) {
      const endpoint = rootGetters['push/endpoint']
      if (endpoint) {
        const result = await http.post('/schedules', {
          schedule,
          push: { endpoint },
        })
        const schedules: Schedule[] = getters.schedules
        schedules.push(result.data)
        commit('setSchedules', schedules)
      }
    },
    async update({ commit, getters, rootGetters }, schedule: Schedule) {
      const endpoint = rootGetters['push/endpoint']
      const result = await http.patch('/schedules/' + schedule.id, {
        schedule,
        push: { endpoint },
      })
      const schedules: Schedule[] = getters.schedules
      const index = schedules.findIndex(s => s.id === schedule.id)
      schedules[index] = result.data
      commit('setSchedules', schedules)
    },
    async delete({ commit, getters }, id: string) {
      await http.delete('/schedules/' + id)
      const schedules: Schedule[] = getters.schedules
      const index = schedules.findIndex(s => s.id === id)
      commit('setSchedules', schedules.splice(index, 1))
    },
  },
}

export default schedulesModule
