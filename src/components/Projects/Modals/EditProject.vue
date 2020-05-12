<template>
  <q-card>
    <modal-header>Edit project</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
          label="Project name"
          :name.sync="projectToSubmit.name"
        />
      </q-card-section>
      <modal-buttons></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import addEditActivitieMixin from "src/mixins/mixin-add-edit-model.js";

export default {
  mixins: [addEditActivitieMixin],
  props: ["project", "projectId"],
  data() {
    return {
      projectToSubmit: {}
    };
  },
  methods: {
    ...mapActions("projects", ["updateProject"]),
    submitModel() {
      this.updateProject({
        id: this.projectId,
        updates: this.projectToSubmit
      });
      this.$emit("close", this.projectId);
    }
  },
  mounted() {
    this.projectToSubmit = Object.assign({}, this.project);
  }
};
</script>
