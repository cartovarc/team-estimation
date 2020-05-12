<template>
  <q-page padding>
    <q-card class="auth-tabs">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login-register />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: "login"
    };
  },
  components: {
    "login-register": require("components/Auth/LoginRegister.vue").default
  }
};
</script>

<style>
.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}
</style>
