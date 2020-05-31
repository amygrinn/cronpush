<template>
  <div
    class="power-button position-relative d-flex justify-content-center align-items-center"
    :loading="loading"
    :off="!on"
  >
    <div v-if="loading" class="spinner position-absolute" />
    <div class="glow position-absolute" />
    <svg
      @click="updatePushSubscription()"
      class="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      :style="
        `width: ${diameter}px; height: ${diameter}px; background-color: ${color};`
      "
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
      />
    </svg>
  </div>
</template>

<style lang="scss">
@import 'variables';

.power-button {
  .spinner {
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 50%;
    background: #ffffff;
    background: linear-gradient(
      to right,
      #ffffff 10%,
      rgba(255, 255, 255, 0) 42%
    );
    animation: spin 0.5s infinite linear;
    z-index: -1;
  }

  .spinner::before {
    width: 50%;
    height: 50%;
    background: #ffffff;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  .spinner::after {
    background: hsl(38, 15, 60);
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .glow {
    z-index: -1;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.6;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  }

  .icon {
    border-radius: 50%;
    transition: width 0.3s, height 0.3s, background-color 0.3s;
    border: 1px solid rgba(0, 0, 0, 0.3);
    cursor: pointer;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
}

.power-button[off] {
  animation: bob 3s infinite 2s;

  .glow {
    animation: pulsate 3s infinite 2s;
  }
}

.power-button[loading] {
  animation: reset 0.2s forwards;

  .glow {
    animation: reset 0.2s forwards;
  }
}

@media (hover: hover) {
  .power-button:hover {
    animation: reset 0.2s forwards;

    .glow {
      animation: reset 0.2s forwards;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulsate {
  0% {
    opacity: 0.4;
  }
  15% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 0.4;
  }
}

@keyframes bob {
  0% {
    transform: translateY(0) rotate(0.001deg);
  }
  15% {
    transform: translateY(-15%) rotate(0.001deg);
  }
  60% {
    transform: translateY(8%) rotate(0.001deg);
  }
}

@keyframes reset {
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0.001deg);
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  props: {
    diameter: {
      type: Number,
      default: 26,
    },
  },
  data: () => ({
    message: false,
    loading: false,
  }),
  computed: {
    ...mapGetters({
      on: 'push/enabled',
    }),
    color() {
      return this.on ? 'var(--primary-light)' : 'var(--gray)'
    },
    radius() {
      return this.on ? 34 : 108
    },
  },
  methods: {
    async updatePushSubscription() {
      if (!this.loading) {
        this.loading = true
        // Wait 3 seconds before updating push subscription
        // await new Promise(resolve => setTimeout(resolve, 3000))
        try {
          this.on
            ? await this.$store.dispatch('push/disableSubscription')
            : await this.$store.dispatch('push/updateSubscription')
        } finally {
          this.loading = false
        }
      }
    },
  },
})
</script>
