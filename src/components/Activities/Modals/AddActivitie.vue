<template>
  <q-card>
    <modal-header>Add activitie</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
          label="Activitie name"
          :name.sync="activitieToSubmit.name"
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
  props: ["sprintId"],
  data() {
    return {
      activitieToSubmit: {
        name: "",
        completed: false
      }
    };
  },
  methods: {
    ...mapActions("sprints", ["addActivitie"]),
    submitModel() {
      this.addActivitie({
        activitieToSubmit: this.activitieToSubmit,
        sprintId: this.sprintId
      });
      this.$emit("close");
    }
  }
};
</script>
