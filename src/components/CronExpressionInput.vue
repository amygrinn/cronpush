<template>
  <div class="cron-expression-input d-flex" :valid="state" :invalid="!state">
    <div
      v-for="(_, i) in 5"
      :key="i"
      class="token d-flex flex-column align-items-center"
    >
      <input
        type="text"
        :tabindex="i + 1"
        :value="tokens[i]"
        @input="onInput(i, $event.target.value)"
      />
      <p>{{ shortDescriptions[i] }}</p>
      <p>{{ longDescriptions[i] }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@import 'variables';

.cron-expression-input {
  overflow-x: auto;

  .token {
    max-width: 20%;
    font-family: 'DM Mono', monospace;
    padding: 2px;

    input {
      border-radius: 8px;
      min-width: 0;
      max-width: 100%;
      text-align: center;
      border: none;
    }

    p {
      font-weight: 300;
      margin-bottom: 0;
      text-align: center;
    }

    p:first-of-type {
      font-size: 12px;
    }

    p:last-of-type {
      font-size: 10px;
    }
  }
}

.cron-expression-input[valid] {
  input {
    border-bottom: 1px solid $primary;
  }
}

.cron-expression-input[invalid] {
  input {
    border-bottom: 1px solid $danger;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'

const shortDescriptions = ['Mins', 'Hours', 'DoM', 'Mo', 'DoW']
const longDescriptions = [
  'Minutes',
  'Hours',
  'Day of Month',
  'Month',
  'Day of Week',
]

export default Vue.extend({
  props: {
    state: Boolean,
    value: String,
  },
  data: () => ({
    tokens: [] as string[],
    shortDescriptions,
    longDescriptions,
  }),
  created() {
    this.tokens = this.value.split(' ')
  },
  watch: {
    value(value) {
      this.tokens = value.split(' ')
    },
  },
  methods: {
    onInput(index: number, value: string) {
      // Add empty strings for tokens that don't exist
      for (let j = this.tokens.length; j <= index; j++) {
        this.tokens.push('')
      }

      this.tokens[index] = value
      this.$emit('input', this.tokens.join(' '))
    },
  },
})
</script>
