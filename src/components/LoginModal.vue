<template>
  <div>
    <b-tabs>
      <b-tab title="Login">
        <b-form @submit.prevent="login">
          <b-form-group label="Username">
            <b-form-input name="username" type="text" required />
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input name="password" type="password" required />
          </b-form-group>
          <b-button type="submit" variant="primary">Login</b-button>
        </b-form>
      </b-tab>
      <b-tab title="Register">
        <b-form @submit.prevent="register">
          <b-form-group label="Username">
            <b-form-input name="username" type="text" required />
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input
              name="password"
              type="password"
              required
              ref="password"
              @change="validatePassword"
            />
          </b-form-group>
          <b-form-group label="Repeat Password">
            <b-form-input
              ref="confirm-password"
              type="password"
              required
              @keyup="validatePassword"
            />
          </b-form-group>
          <b-button type="submit" variant="primary">Register</b-button>
        </b-form>
      </b-tab>
    </b-tabs>
    <b-alert :show="!!error" variant="danger" class="mt-1">{{ error }}</b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    error: '',
  }),
  methods: {
    formDataToJSON(formData: FormData) {
      return Array.from(formData.entries()).reduce((json, [key, value]) => {
        json[key] = value
        return json
      }, {} as any)
    },
    validatePassword() {
      if (
        (this.$refs['password'] as any).$el.value ===
        (this.$refs['confirm-password'] as any).$el.value
      ) {
        ;(this.$refs['confirm-password'] as any).$el.setCustomValidity('')
      } else {
        ;(this.$refs['confirm-password'] as any).$el.setCustomValidity(
          'Passwords must match'
        )
      }
    },
    async register(ev: Event) {
      const formData = new FormData(ev.target as HTMLFormElement)
      const user = this.formDataToJSON(formData)
      try {
        await this.$store.dispatch('auth/register', user)
        this.$emit('close')
      } catch (err) {
        this.error = 'Registration error: ' + err.message
      }
    },
    async login(ev: Event) {
      const formData = new FormData(ev.target as HTMLFormElement)
      const user = this.formDataToJSON(formData)
      try {
        await this.$store.dispatch('auth/login', user)
        this.$emit('close')
      } catch (err) {
        this.error = 'Login error: ' + err.message
      }
    },
  },
})
</script>
