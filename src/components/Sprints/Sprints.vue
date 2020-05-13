<template>
  <div>
    <div class="q-mb-md" v-for="(sprint, key) in sprints" :key="key">
      <template v-if="sprint.project == globalSelectedProject.value">
        <list-header :bgColor="'bg-primary'">
          <sprint class="q-ma-none q-pa-none" :sprint="sprint" :id="key">
          </sprint>
        </list-header>
        <q-list v-if="activitiesDownloaded" bordered separated>
          <div
            v-for="(activity, key2) in activities[key]"
            v-bind:key="activity.id"
          >
            <activitie :activity="activity" :activityId="key2" />
          </div> </q-list
      ></template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["sprints"],
  computed: {
    ...mapState("activities", ["activities", "activitiesDownloaded"]),
    ...mapState("projects", ["globalSelectedProject"])
  },
  components: {
    sprint: require("components/Sprints/Sprint.vue").default,
    "list-header": require("components/Shared/ListHeader.vue").default,
    activitie: require("components/Activities/Activitie.vue").default
  }
};
</script>
