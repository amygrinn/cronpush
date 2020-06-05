import { Module } from 'vuex'
import cronstrue from 'cronstrue'
import cronParser from 'cron-parser'
import { DateTime } from 'luxon'

import http from './http'

export interface Schedule {
  id: string
  title: string
  message: string
  icon: string
  cronExpression: string
  enabled: boolean
  prev?: Date
  next?: Date
  nextString: String
  description: String
}

interface SchedulesModule {
  schedules: Schedule[]
}

const createSchedule = (schedule: Partial<Schedule>): Schedule => {
  if (
    !schedule.id ||
    !schedule.title ||
    schedule.message == null ||
    !schedule.icon ||
    !schedule.cronExpression ||
    schedule.enabled == null
  ) {
    throw new Error('Invalid schedule object')
  }

  try {
    schedule.description = cronstrue.toString(schedule.cronExpression)

    const expression = cronParser.parseExpression(schedule.cronExpression)

    schedule.prev = expression.prev().toDate()
    schedule.next = expression.next().toDate()

    const nextString = DateTime.fromJSDate(schedule.next).toRelative()
    if (nextString) {
      schedule.nextString =
        nextString.charAt(0).toUpperCase() + nextString.substring(1)
    } else {
      schedule.nextString = ''
    }
  } catch (err) {
    schedule.description = 'Parse error'
    schedule.nextString = err.message
  }

  return schedule as Schedule
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
      state.schedules = schedules.sort((a, b) => {
        if (!b.enabled || !a.enabled) {
          return +b.enabled - +a.enabled
        }

        if (b.next && a.next) {
          return a.next.getTime() - b.next.getTime()
        }

        if (a.title > b.title) {
          return 1
        }

        if (a.title < b.title) {
          return -1
        }

        return 0
      })
    },
  },
  actions: {
    init: {
      root: true,
      handler({ commit, getters }) {
        setInterval(() => {
          commit('setSchedules', getters['schedules'].map(createSchedule))
        }, 1000)
      },
    },
    async refresh({ commit, rootGetters }) {
      const endpoint = rootGetters['push/endpoint']
      if (endpoint) {
        const result = await http.get('/schedules', { params: { endpoint } })
        commit('setSchedules', result.data.schedules.map(createSchedule))
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
        commit('setSchedules', schedules.map(createSchedule))
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
      commit('setSchedules', schedules.map(createSchedule))
    },
    async delete({ commit, getters }, id: string) {
      await http.delete('/schedules/' + id)
      const schedules: Schedule[] = getters.schedules

      const index = schedules.findIndex(s => s.id === id)
      schedules.splice(index, 1)
      commit('setSchedules', schedules.map(createSchedule))
    },
  },
}

export default schedulesModule
