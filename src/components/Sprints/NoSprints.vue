<template>
  <transition appear enter-active-class="animated zoomIn">
    <q-banner class="bg-grey-3">
      <template v-slot:avatar>
        <q-icon name="warning" color="primary" />
      </template>
      No sprints in {{ globalSelectedProject.label }}
    </q-banner>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("projects", ["globalSelectedProject"])
  }
};
</script>
