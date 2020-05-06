<template>
  <div>
    <div v-for="(sprint, key) in sprints" :key="key">
      <list-header :bgColor="'bg-orange-4'">
        <sprint class="q-ma-none q-pa-none" :sprint="sprint" :id="key">
        </sprint>
      </list-header>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["sprints"],
  computed: {},
  components: {
    sprint: require("components/Sprints/Sprint.vue").default,
    "list-header": require("components/Shared/ListHeader.vue").default
  }
};
</script>
