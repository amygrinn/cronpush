<template>
  <div @click.prevent="$emit('check', !$refs['checkbox'].checked)">
    <div class="d-flex">
      <b-form-checkbox
        class="readonly"
        ref="checkbox"
        switch
        :checked="checked"
      >
        {{ message }}
      </b-form-checkbox>
      <b-spinner
        :style="{
          visibility: loading ? 'visible' : 'hidden',
        }"
        class="m-1"
        variant="primary"
        small
      ></b-spinner>
    </div>
  </div>
</template>

<style lang="scss">
.readonly,
.readonly input,
.readonly label {
  pointer-events: none;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    message: String,
    checked: Boolean,
    loading: Boolean,
  },
})
</script>
