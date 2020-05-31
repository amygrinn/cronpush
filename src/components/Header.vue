<template>
  <div class="header d-flex flex-column align-items-center" :on="on" :off="!on">
    <div class="overlay position-fixed" />

    <p class="instructions position-fixed" v-if="!on">
      Click to enter or <a>learn more</a>
    </p>

    <div class="d-flex flex-column px-2" style="max-width: 100%">
      <div class="title mt-2 position-relative d-flex justify-content-center">
        <h1>Cron</h1>

        <div class="power-button-slot d-flex justify-content-center">
          <div class="power-button-container m-auto">
            <power-button :diameter="on ? 36 : 108" />
          </div>
        </div>

        <h1>Push</h1>
      </div>

      <div class="toolbar">
        <div class="d-flex justify-content-end">
          <i
            class="material-icons toolbar-item"
            @click="$bvModal.show('login-modal')"
          >
            person
          </i>
        </div>
      </div>
    </div>

    <!-- MODALS -->

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
  </div>
</template>

<style lang="scss" scoped>
@import 'variables';

h1 {
  color: white;
  z-index: -1;
}

.overlay {
  background-color: $background-disabled;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.title {
  z-index: 6;
}

.instructions {
  z-index: 6;
  animation: fade_in 1s 2s forwards;
  opacity: 0;
  color: white;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  a {
    color: $primary-light;
    text-decoration: underline;
    cursor: pointer;
  }
}

.toolbar i {
  background-color: white;
  margin: 4px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.toolbar i:hover {
  transform: scale(1.1);
}

.header[on] {
  .overlay {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s 0.5s;
  }

  .title {
    transition: transform 0.4s ease-in-out 0.1s;
  }

  .power-button-container {
    transition: transform 0.3s ease-in-out 0.2s;
  }

  .power-button-slot {
    width: 120px;
    transition: width 0.4s ease-out;
  }
}

.header[off] {
  .overlay {
    transition: opacity 0.3s;
    opacity: 1;
    pointer-events: auto;
  }

  .title {
    transform: translateY(16vh);
    transition: transform 0.3s ease-in 0.2s;
  }

  .power-button-slot {
    width: 14px;
    transition: width 0.3s ease-out 0.2s;
  }

  .power-button-container {
    transform: translateY(140px);
    transition: transform 0.3s ease-in-out;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

import LoginModal from './LoginModal.vue'
import PowerButton from './PowerButton.vue'

export default Vue.extend({
  components: {
    LoginModal,
    PowerButton,
  },
  computed: {
    ...mapGetters({
      on: 'push/enabled',
    }),
  },
})
</script>
