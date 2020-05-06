<template>
  <div>
    <div class="q-mb-md" v-for="(sprint, key) in sprints" :key="key">
      <list-header :bgColor="'bg-primary'">
        <sprint class="q-ma-none q-pa-none" :sprint="sprint" :id="key">
        </sprint>
      </list-header>
      <q-list bordered separated>
        <activitie
          v-for="(activitie, key2) in sprint.activities"
          v-bind:key="activitie.id"
          :activitie="activitie"
          :sprintId="key"
          :activitieId="key2"
        />
      </q-list>
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
    "list-header": require("components/Shared/ListHeader.vue").default,
    activitie: require("components/Activities/Activitie.vue").default
  }
};
</script>
