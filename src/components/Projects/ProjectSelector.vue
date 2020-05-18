<template>
  <q-select
    ref="projectSelector"
    outlined
    v-model="selectedProject"
    class="full-width q-mb-md"
    bg-color="white"
    :options="projectsArray"
    label="Project"
    @input="$emit('projectChanged')"
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
          v-if="!emptyProjects && isMember"
          size="sm"
          dense
          flat
          color="blue-5"
          icon="edit"
        />
        <q-btn
          v-if="!emptyProjects && isMember"
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
      <add-project @close="handleAddClose" />
    </q-dialog>
    <q-dialog v-model="showEditProject">
      <edit-project
        :project="projects[globalSelectedProject.value]"
        :projectId="globalSelectedProject.value"
        @close="handleEditClose"
      />
    </q-dialog>
  </q-select>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { firebaseAuth } from "boot/firebase";

export default {
  computed: {
    ...mapGetters("projects", ["getProject"]),
    ...mapState("projects", ["projects", "globalSelectedProject"]),
    ...mapState("members", ["members"]),

    emptyProjects() {
      return !this.globalSelectedProject.value;
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
    projectsArray() {
      let uid = firebaseAuth.currentUser.uid;

      let thisAux = this;
      return Object.keys(this.projects)
        .map(function(projectId) {
          return { label: thisAux.projects[projectId].name, value: projectId };
        })
        .filter(value => {
          if (this.members[value.value]) {
            let isMember = false;
            this.members[value.value].forEach(member => {
              isMember = isMember || member.value == uid;
            });
            return isMember;
          } else {
            return false;
          }
        });
    },
    selectedProject: {
      get() {
        let exists = false;
        this.projectsArray.forEach(value => {
          exists = exists || this.globalSelectedProject.value == value.value;
        });
        return exists
          ? this.globalSelectedProject
          : { label: "No selected", value: null };
      },
      set(value) {
        this.setSelectedProject(value);
      }
    },
    selectedProjectId() {
      return this.globalSelectedProject.value;
    }
  },
  data() {
    return {
      showAddProject: false,
      showEditProject: false
    };
  },
  methods: {
    ...mapActions("projects", ["deleteProject", "setSelectedProject"]),
    ...mapGetters("projects", ["firstProject"]),
    handleEditClose(projectId) {
      this.showEditProject = false;
      this.setSelectedProject(this.getProject(projectId));
    },
    handleAddClose() {
      this.showAddProject = false;
      this.setSelectedProject(this.firstProject());
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
          this.setSelectedProject(this.firstProject());
        });
    }
  },
  components: {
    "add-project": require("components/Projects/Modals/AddProject.vue").default,
    "edit-project": require("components/Projects/Modals/EditProject.vue")
      .default
  },
  mounted() {
    this.setSelectedProject(this.firstProject());
  }
};
</script>
