<template>
  <q-card>
    <modal-header>Add project</modal-header>
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
  data() {
    return {
      projectToSubmit: {
        name: ""
      }
    };
  },
  methods: {
    ...mapActions("projects", ["addProject"]),
    submitModel() {
      this.addProject({
        project: this.projectToSubmit
      });
      this.$emit("close");
    }
  }
};
</script>
