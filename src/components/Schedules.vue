<template>
  <div>
    <transition-group
      name="schedules-animation"
      class="schedules-container d-flex justify-content-center flex-wrap"
    >
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

    <fab v-b-modal.create-schedule-modal />

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
.schedules-container {
  display: flex;
}
</style>

<script lang="ts">
import Vue from 'vue'

import Fab from './Fab.vue'
import Schedule from './Schedule.vue'
import ScheduleModal from '../components/ScheduleModal.vue'

export default Vue.extend({
  components: {
    Fab,
    Schedule,
    ScheduleModal,
  },
  props: ['schedules'],
  data: () => ({
    selectedSchedule: {},
  }),
})
</script>
