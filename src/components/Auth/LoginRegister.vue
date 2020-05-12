<template>
  <form @submit.prevent="submitForm">
    <div class="row q-mb-md">
      <q-banner class="bg-grey-3 col">
        <template v-slot:avatar>
          <q-icon name="account_circle" color="primary" />
        </template>
        Login / Register to access to simple estimation app
      </q-banner>
    </div>
    <div class="row q-mb-md">
      <q-btn class="full-width" type="submit" color="white">
        <q-avatar>
          <img style="max-width: 32px" src="statics/google.svg" />
        </q-avatar>
        <div class="q-ma-sm text-weight-bold" style="color: grey">
          Login / Register
        </div>
      </q-btn>
    </div>
  </form>
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("auth", ["loginUser"]),
    submitForm() {
      this.loginUser();
    }
  }
};
</script>
