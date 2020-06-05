<template>
  <div
    class="d-flex justify-content-center"
    style="height: calc(var(--vh, 1vh) * 100)"
  >
    <div class="position-relative w-100">
      <Header />

      <schedules :schedules="schedules" />
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/index.scss';

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

import Schedules from '../components/Schedules.vue'
import Header from '../components/Header.vue'

export default Vue.extend({
  components: {
    Schedules,
    Header,
  },
  data: () => ({
    updatingPushSubscription: false,
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
