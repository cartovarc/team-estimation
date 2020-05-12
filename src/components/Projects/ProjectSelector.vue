<template>
  <q-select
    ref="projectSelector"
    outlined
    v-model="model"
    class="full-width q-mb-md"
    bg-color="white"
    :options="projectsArray"
    label="Project"
  >
    <template v-slot:prepend>
      <div class="row">
        <q-btn
          @click.stop="showAddProject = true"
          size="sm"
          dense
          flat
          color="green"
          icon="add"
        />
        <q-btn
          @click.stop="showEditProject = true"
          size="sm"
          dense
          flat
          color="blue-5"
          icon="edit"
        />
        <q-btn
          @click.stop="promptToDelete()"
          size="sm"
          flat
          dense
          color="red"
          icon="delete"
        />
      </div>
    </template>
    <q-dialog v-model="showAddProject">
      <add-project @close="showAddProject = false" />
    </q-dialog>
    <q-dialog v-model="showEditProject">
      <edit-project
        :project="selectedProject"
        :projectId="selectedProjectId"
        @close="handleClose"
      />
    </q-dialog>
  </q-select>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("projects", ["getProject"]),
    ...mapState("projects", ["projects"]),
    projectsArray() {
      let thisAux = this;
      return Object.keys(this.projects).map(function(projectId) {
        return { label: thisAux.projects[projectId].name, value: projectId };
      });
    },
    selectedProject() {
      return this.projects[this.model.value];
    },
    selectedProjectId() {
      return this.model.value;
    }
  },
  data() {
    return {
      model: null,
      showAddProject: false,
      showEditProject: false
    };
  },
  methods: {
    ...mapActions("projects", ["deleteProject"]),
    ...mapGetters("projects", ["firstProject"]),
    handleClose(projectId) {
      this.showEditProject = false;
      this.model = this.getProject(projectId);
    },
    promptToDelete() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteProject(this.selectedProjectId);
          this.model = this.firstProject();
        });
    }
  },
  components: {
    "add-project": require("components/Projects/Modals/AddProject.vue").default,
    "edit-project": require("components/Projects/Modals/EditProject.vue")
      .default
  },
  mounted() {
    this.model = this.firstProject();
  }
};
</script>
