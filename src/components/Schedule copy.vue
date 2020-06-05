<template>
  <div class="w-100 p-3">
    <b-card
      class="position-relative"
      :style="schedule.enabled ? '' : 'background-color: rgba(0, 0, 0, 0.3);'"
    >
      <template v-slot:header>
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex">
            <div class="height-100 d-flex align-items-center mb-1 mr-2">
              <img :src="schedule.icon" style="width: 24px; height: 24px;" />
            </div>
            <h4>{{ schedule.title }}</h4>
          </div>
          <i @click="$emit('edit')" class="material-icons">edit</i>
        </div>
      </template>
      <div class="">
        <delayed-checkbox
          class="mb-3"
          message="Enabled"
          :checked="schedule.enabled"
          @check="toggleEnabled"
          :loading="updating"
        />
        <p v-if="schedule.message"><b>Message: </b> {{ schedule.message }}</p>
        <p><b>Notify me:</b> {{ schedule.description }}</p>
        <p v-if="schedule.enabled && pushEnabled" class="text-center">
          {{ schedule.nextString }}
        </p>
      </div>
    </b-card>
  </div>
</template>

<style lang="scss">
.overlay {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import cronstrue from 'cronstrue'
import { DateTime } from 'luxon'
import cronParser from 'cron-parser'

import DelayedCheckbox from './DelayedCheckbox.vue'

export default Vue.extend({
  components: {
    DelayedCheckbox,
  },
  props: {
    schedule: Object,
  },
  data: () => ({
    updating: false,
  }),
  filters: {
    cronstrue: cronstrue.toString,
  },
  computed: {
    ...mapGetters({
      pushEnabled: 'push/enabled',
    }),
  },
  methods: {
    async toggleEnabled(enabled: boolean) {
      if (!this.updating) {
        this.updating = true
        try {
          await this.$store.dispatch('schedules/update', {
            id: this.schedule.id,
            enabled,
          })
        } finally {
          this.updating = false
        }
      }
    },
  },
})
</script>
