<template>
  <div
    class="d-flex justify-content-center"
    style="height: calc(var(--vh, 1vh) * 100)"
  >
    <div style="max-width: 640px;" class="position-relative w-100">
      <Header />

      <div class="d-flex flex-column align-items-center">
        <transition-group name="schedules-animation" class="w-100">
          <schedule
            v-for="schedule in schedules"
            :key="schedule.id"
            :schedule="schedule"
            @edit="
              selectedSchedule = schedule
              $bvModal.show('edit-schedule-modal')
            "
          />
        </transition-group>
      </div>
    </div>

    <fab
      v-show="!!pushSubscription"
      v-b-modal.create-schedule-modal
      position="bottom-right"
      icon-size="small"
      class="position-fixed"
    />

    <!-- MODALS -->

    <b-modal id="create-schedule-modal" title="Create Schedule" hide-footer>
      <schedule-modal create @close="$bvModal.hide('create-schedule-modal')" />
    </b-modal>

    <b-modal id="edit-schedule-modal" title="Edit Schedule" hide-footer>
      <schedule-modal
        edit
        :schedule="selectedSchedule"
        @close="$bvModal.hide('edit-schedule-modal')"
      />
    </b-modal>
  </div>
</template>

<style lang="scss">
@import './styles/index.scss';

.fab-main {
  background-color: $primary !important;
}

:focus {
  outline: none;
}

.schedules-animation-move {
  transition: transform 0.3s ease-out;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Fab from 'vue-fab'

import DelayedCheckbox from './components/DelayedCheckbox.vue'
import Schedule from './components/Schedule.vue'
import ScheduleModal from './components/ScheduleModal.vue'
import Header from './components/Header.vue'

export default Vue.extend({
  components: {
    // DelayedCheckbox,
    Fab,
    Schedule,
    ScheduleModal,
    Header,
  },
  data: () => ({
    updatingPushSubscription: false,
    selectedSchedule: {},
  }),
  computed: {
    ...mapGetters({
      user: 'auth/user',
      pushSubscription: 'push/enabled',
      schedules: 'schedules/schedules',
    }),
  },
  methods: {
    async updatePushSubscription(enable: boolean) {
      if (!this.updatingPushSubscription) {
        this.updatingPushSubscription = true
        try {
          enable
            ? await this.$store.dispatch('push/updateSubscription')
            : await this.$store.dispatch('push/disableSubscription')
        } finally {
          this.updatingPushSubscription = false
        }
      }
    },
  },
})
</script>
