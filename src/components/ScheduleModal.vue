<template>
  <b-form @submit.prevent>
    <b-modal
      id="delete-schedule-modal"
      title="Delete Schedule"
      @ok="deleteSchedule"
      ok-title="Delete"
    >
      <p>Are you sure you delete this schedule?</p>
    </b-modal>

    <b-modal
      id="icons-modal"
      title="Choose Icon"
      hide-footer
      class="d-flex flex-wrap"
    >
      <img
        v-for="icon in icons"
        :key="icon"
        :src="icon"
        class="icon"
        @click="
          newSchedule.icon = icon
          $bvModal.hide('icons-modal')
        "
      />
    </b-modal>

    <b-modal id="recipes-modal" title="Choose a recipe" hide-footer>
      <b-list-group>
        <b-list-group-item
          v-for="recipe in recipes"
          :key="recipe"
          @click="
            newSchedule.cronExpression = recipe
            $bvModal.hide('recipes-modal')
          "
        >
          {{ recipe | cronstrue }}
        </b-list-group-item>
      </b-list-group>
    </b-modal>

    <b-form-group>
      <b-form-checkbox switch v-model="newSchedule.enabled">
        Enabled
      </b-form-checkbox>
    </b-form-group>
    <b-form-group>
      <img :src="newSchedule.icon" class="icon" v-b-modal.icons-modal />
    </b-form-group>
    <b-form-group label="Title">
      <b-form-input required v-model="newSchedule.title" />
    </b-form-group>
    <b-form-group label="Message">
      <b-form-input v-model="newSchedule.message" />
    </b-form-group>
    <b-form-group
      :state="validCronExpression"
      :invalid-feedback="cronExpressionError"
    >
      <template v-slot:label>
        <div class="d-flex justify-content-between align-items-center">
          <p class="mb-0">Cron Expression</p>
          <b-button class="mb-1" v-b-modal.recipes-modal>Recipes</b-button>
        </div>
      </template>
      <cron-expression-input
        :state="validCronExpression"
        v-model="newSchedule.cronExpression"
      />
    </b-form-group>
    <b-form-group>
      <p v-if="validCronExpression">
        {{ newSchedule.cronExpression | cronstrue }}
      </p>
    </b-form-group>
    <div class="d-flex">
      <b-button
        @click="make"
        v-if="create"
        :disabled="!validSchedule"
        type="submit"
        variant="primary"
      >
        Create
      </b-button>
      <b-button
        v-if="edit"
        @click="save"
        :disabled="!validSchedule"
        type="submit"
        variant="primary"
      >
        Save
      </b-button>
      <b-button
        v-b-modal.delete-schedule-modal
        type="submit"
        variant="danger"
        class="ml-2"
        v-if="edit"
      >
        Delete
      </b-button>
    </div>
  </b-form>
</template>

<style lang="scss" scoped>
.icon {
  width: 36px;
  height: 36px;
  border: 1px solid black;
  border-radius: 6px;
  margin: 4px;
  padding: 8px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import cronstrue from 'cronstrue'
import cronParser from 'cron-parser'

import CronExpressionInput from './CronExpressionInput.vue'

const icons = [
  '/icons/alarm.png',
  '/icons/bar.png',
  '/icons/cake.png',
  '/icons/check.png',
  '/icons/exercise.png',
  '/icons/happy.png',
  '/icons/house.png',
  '/icons/people.png',
  '/icons/phone.png',
  '/icons/school.png',
  '/icons/shopping.png',
  '/icons/star.png',
  '/icons/sun.png',
  '/icons/work.png',
]

const recipes = [
  '*/15 8-22 * * *',
  '0 9-17 * * *',
  '15 8 ? * Mon-Fri',
  '15 10 15 * ?',
  '0 18 */5 * ?',
]

const validCronExpression = (expression: string) => {
  const tokens = expression.split(' ')

  if (tokens.length !== 5 || tokens.findIndex(token => !token) > -1) {
    return false
  }

  try {
    cronstrue.toString(expression)
    cronParser.parseExpression(expression)
    return true
  } catch {
    return false
  }
}

export default Vue.extend({
  components: {
    CronExpressionInput,
  },
  props: {
    create: Boolean,
    edit: Boolean,
    schedule: Object,
  },
  data: () => ({
    newSchedule: {
      id: '',
      enabled: true,
      title: '',
      message: '',
      icon: '/icons/star.png',
      cronExpression: '0 * * * *',
    },
    icons,
    recipes,
  }),
  filters: {
    cronstrue(expression: string) {
      try {
        return cronstrue.toString(expression)
      } catch (err) {
        return ''
      }
    },
  },
  created() {
    if (this.create === this.edit) {
      throw new Error(`Specify either 'create' or 'edit' flags`)
    }

    if (this.edit) {
      Object.assign(this.newSchedule, this.schedule)
    }
  },
  methods: {
    async save() {
      await this.$store.dispatch('schedules/update', this.newSchedule)
      this.$emit('close')
    },
    async make() {
      await this.$store.dispatch('schedules/create', this.newSchedule)
      this.$emit('close')
    },
    async deleteSchedule() {
      await this.$store.dispatch('schedules/delete', this.newSchedule.id)
      this.$emit('close')
    },
  },
  computed: {
    validCronExpression() {
      if (validCronExpression(this.newSchedule.cronExpression)) {
        return true
      }
      return false
    },
    cronExpressionError() {
      const tokens = this.newSchedule.cronExpression.split(' ')

      if (tokens.length !== 5 || tokens.findIndex(token => !token) > -1) {
        return 'Expression must have 5 parts'
      }

      try {
        cronParser.parseExpression(this.newSchedule.cronExpression)
      } catch (err) {
        return err.message
      }

      return ''
    },
    validSchedule() {
      if (
        this.newSchedule.title &&
        validCronExpression(this.newSchedule.cronExpression)
      ) {
        return true
      }
      return false
    },
  },
})
</script>
