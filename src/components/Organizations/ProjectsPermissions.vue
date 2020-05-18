<template>
  <q-list bordered separator>
    <q-item v-for="(project, key) in projects" v-bind:key="key">
      <member-select :project="project" :projectId="key" />
    </q-item>
  </q-list>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("projects", ["projects"])
  },
  components: {
    "member-select": require("src/components/Organizations/MembersSelect.vue")
      .default
  }
};
</script>

<style scoped></style>
