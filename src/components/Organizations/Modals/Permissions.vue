<template>
  <q-card>
    <q-card-section class="q-pt">
      <q-list dense bordered padding class="rounded-borders">
        <q-item clickable v-ripple>
          <q-item-section>
            TEST
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            TEST
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            TEST
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState("organizations", ["selectedOrganization"])
  },
  data() {
    return {};
  },
  components: {}
};
</script>
