<template>
  <q-page>
    <div class="q-pa-md full-height full-width absolute column">
      <template v-if="sprintsDownloaded">
        <q-scroll-area class="q-scroll-area-sprints">
          <proyect-selector />

          <no-sprints
            v-if="showNoSprints"
            @showAddSprint="showAddSprint = true"
          />

          <q-item-label
            v-if="existsSprintInProject && isMember"
            header
            class="q-pa-none q-mb-sm"
            >Sprints of "{{ globalSelectedProject.label }}"</q-item-label
          >

          <sprints
            v-if="existsSprintInProject && isMember"
            :sprints="sprints"
          />
        </q-scroll-area>

        <div
          v-if="globalSelectedProject.value"
          class="absolute-bottom text-center q-mb-lg no-pointer-events"
        >
          <q-btn
            @click="showAddSprint = true"
            round
            class="all-pointer-events"
            color="primary"
            size="24px"
            icon="add"
          />
        </div>
      </template>

      <template v-else>
        <span class="absolute-center">
          <q-spinner color="primary" size="3em" />
        </span>
      </template>
    </div>

    <q-dialog v-model="showAddSprint">
      <add-sprint @close="showAddSprint = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { firebaseAuth } from "boot/firebase";

export default {
  data() {
    return {
      showAddSprint: false
    };
  },
  computed: {
    ...mapGetters("sprints", ["sprints"]),
    ...mapState("sprints", ["sprintsDownloaded"]),
    ...mapState("projects", ["globalSelectedProject"]),
    ...mapState("members", ["members"]),

    existsSprintInProject() {
      let thisAux = this;
      let exists = false;
      Object.keys(this.sprints).map(function(sprintId) {
        exists =
          exists ||
          thisAux.sprints[sprintId].project ==
            thisAux.globalSelectedProject.value;
      });
      return exists;
    },
    isMember() {
      let uid = firebaseAuth.currentUser.uid;
      if (uid && this.globalSelectedProject.value) {
        let isMember = false;
        if (!this.members[this.globalSelectedProject.value]) {
          return false;
        }
        this.members[this.globalSelectedProject.value].forEach(member => {
          isMember = isMember || member.value == uid;
        });
        return isMember;
      } else {
        return false;
      }
    },
    showNoSprints() {
      return !this.existsSprintInProject && this.globalSelectedProject.value;
    }
  },
  components: {
    "add-sprint": require("components/Sprints/Modals/AddSprint.vue").default,
    "no-sprints": require("components/Sprints/NoSprints.vue").default,
    sprints: require("components/Sprints/Sprints.vue").default,
    "proyect-selector": require("components/Projects/ProjectSelector.vue")
      .default
  },
  mounted() {
    this.$root.$on("showAddSprint", () => {
      this.showAddSprint = true;
    });
  }
};
</script>

<style>
.q-scroll-area-sprints {
  display: flex;
  flex-grow: 1;
}
</style>
