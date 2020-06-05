<template>
  <div
    class="schedule position-relative"
    :style="`--duration: ${duration}ms; --ellapsed: ${ellapsed}ms;`"
    :enabled="schedule.enabled"
    :disabled="!schedule.enabled"
  >
    <div class="schedule-container">
      <svg
        v-if="schedule.enabled"
        class="schedule-timer position-absolute w-100 h-100"
        preserveAspectRatio="none"
        viewBox="0 0 100 50"
      >
        <rect x="3" y="3" width="94" height="44" class="track" fill="none" />
        <path
          @animationstart="animationStarted"
          class="progress"
          d="M 50 47
          L 3 47
          L 3 3
          L 50 3"
        />
        <path
          class="progress"
          d="M50 47
          L97 47
          L97 3
          L50 3"
          fill="none"
        />
      </svg>

      <div class="body">
        <div
          class="header mb-2 d-flex justify-content-between align-items-center"
        >
          <h3
            class="flex-grow-1"
            v-resize-text="{ maxFontSize: '24px', ratio: 1.5 }"
          >
            {{ schedule.title }}
          </h3>
          <i @click="$emit('edit')" class="material-icons">edit</i>
        </div>

        <delayed-checkbox
          :message="schedule.enabled ? 'Enabled' : 'Disabled'"
          :checked="schedule.enabled"
          @check="toggleEnabled"
          :loading="updating"
        />
        <p class="text-muted">{{ schedule.description }}</p>
        <p v-if="schedule.enabled">{{ schedule.nextString }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'variables';

.schedule {
  margin: 8px;

  border-radius: 4px;

  width: calc(100% - 16px);
  max-width: 350px;

  h3 {
    font-family: 'Major Mono Display', monospace;
    margin: 0;
  }

  .body {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24px;

    p {
      font-size: 12px;
      margin: 4px 0;
    }

    h3 {
      font-family: 'Major Mono Display', monospace;
      margin: 0;
    }
    .header {
      height: 18px;
    }

    .description {
      font-size: 14px;
    }
  }
}

.schedule-container {
  width: 100%;
  padding-top: 50%;
  position: relative;
  box-sizing: border-box;
}

.schedule[enabled] {
  background-color: $secondary-light;
  box-shadow: 0 0 6px 4px rgba(255, 255, 255, 0.3);
}
.schedule[disabled] {
  background-color: $secondary;
  box-shadow: inset 0 0 6px 3px rgba(0, 0, 0, 0.4);
}

.schedule-timer {
  top: 0;
  left: 0;
  pointer-events: none;

  .track {
    stroke: white;
    stroke-width: 1;
  }

  .progress {
    stroke-width: 1;
    fill: none;
    animation: dash var(--duration) linear var(--ellapsed) infinite;
  }

  @keyframes dash {
    from {
      stroke: $success;
      stroke-dasharray: 138;
      stroke-dashoffset: 138;
    }
    to {
      stroke: $danger;
      stroke-dasharray: 138;
      stroke-dashoffset: 0;
    }
  }
}

// Medium devices
@media only screen and (min-width: 330px) {
  .schedule .body {
    .header {
      height: 24px;
    }

    p {
      font-size: 14px;
      margin: 5px 0;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'

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
    animationStart: (undefined as unknown) as Date,
  }),
  computed: {
    duration() {
      const next = this.schedule.next.getTime()
      const prev = this.schedule.prev.getTime()
      return next - prev
    },
    ellapsed() {
      if (!this.schedule.enabled || !this.animationStart) {
        return 0
      }

      const prev = this.schedule.prev.getTime()
      let start = this.animationStart.getTime()
      return prev - start
    },
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
    animationStarted() {
      this.animationStart = new Date()
    },
  },
  watch: {
    schedule: {
      deep: true,
      handler(schedule) {
        if (!schedule.enabled) {
          this.animationStart = (undefined as unknown) as Date
        }
      },
    },
  },
})
</script>
