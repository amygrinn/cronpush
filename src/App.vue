<template>
  <div class="d-flex justify-content-center" style="height: calc(var(--vh, 1vh) * 100)">
    <div style="max-width: 640px;" class="position-relative w-100">
      <fab
        v-show="!!pushSubscription"
        v-b-modal.create-schedule-modal
        position="bottom-right"
        icon-size="small"
        class="position-absolute"
      />

      <b-modal id="login-modal" title="Login/Register" hide-footer>
        <login-modal @close="$bvModal.hide('login-modal')" />
      </b-modal>

      <b-modal
        id="logout-modal"
        title="Log Out"
        @ok="$store.dispatch('auth/logout')"
        ok-title="Log Out"
      >
        <p>Are you sure you want to log out?</p>
      </b-modal>

      <b-modal id="create-schedule-modal" title="Create Schedule" hide-footer>
        <schedule-modal
          create
          @close="$bvModal.hide('create-schedule-modal')"
        />
      </b-modal>

      <b-modal id="edit-schedule-modal" title="Edit Schedule" hide-footer>
        <schedule-modal
          edit
          :schedule="selectedSchedule"
          @close="$bvModal.hide('edit-schedule-modal')"
        />
      </b-modal>

      <b-navbar>
        <b-navbar-brand href="/">Cron Push</b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <b-nav-item key="login" v-if="!user" v-b-modal.login-modal
            >Login</b-nav-item
          >
          <b-nav-item key="logout" v-else v-b-modal.logout-modal
            >Log Out</b-nav-item
          >
        </b-navbar-nav>
      </b-navbar>

      <div class="d-flex flex-column align-items-center">
        <delayed-checkbox
          class="mb-3"
          message="Push notifications"
          :checked="!!pushSubscription"
          :loading="updatingPushSubscription"
          @check="updatePushSubscription"
        />

        <schedule
          v-for="schedule in schedules"
          :key="schedule.id"
          :schedule="schedule"
          @edit="
            selectedSchedule = schedule
            $bvModal.show('edit-schedule-modal')
          "
        />
      </div>
    </div>
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
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Fab from 'vue-fab'

import LoginModal from './components/LoginModal.vue'
import DelayedCheckbox from './components/DelayedCheckbox.vue'
import Schedule from './components/Schedule.vue'
import ScheduleModal from './components/ScheduleModal.vue'

export default Vue.extend({
  components: {
    LoginModal,
    DelayedCheckbox,
    Fab,
    Schedule,
    ScheduleModal,
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
