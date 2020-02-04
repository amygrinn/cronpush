<template>
  <div class="w-100 p-3">
    <b-card
      class="position-relative"
      :style="
        schedule.enabled && pushEnabled
          ? ''
          : 'background-color: rgba(0, 0, 0, 0.3);'
      "
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
        <p><b>Message: </b> {{ schedule.message }}</p>
        <p><b>Notify me:</b> {{ schedule.cronExpression | cronstrue }}</p>
        <p v-if="schedule.enabled && pushEnabled" class="text-center">
          {{ nextOccurence }}
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
    nextOccurence: '',
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
  created() {
    setInterval(() => {
      const nextDate = cronParser
        .parseExpression(this.schedule.cronExpression)
        .next()
        .toDate()
      const relativeToNow = DateTime.fromJSDate(nextDate).toRelative()
      if (relativeToNow) {
        this.nextOccurence =
          relativeToNow.charAt(0).toUpperCase() + relativeToNow.substring(1)
      } else {
        this.nextOccurence = ''
      }
    }, 1000)
  },
})
</script>
