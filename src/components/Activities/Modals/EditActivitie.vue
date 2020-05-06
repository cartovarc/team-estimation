<template>
  <q-card>
    <modal-header>Edit activitie</modal-header>
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
  props: ["activitie", "activitieId", "sprintId"],
  data() {
    return {
      activitieToSubmit: {}
    };
  },
  methods: {
    ...mapActions("sprints", ["updateActivitie"]),
    submitModel() {
      this.updateActivitie({
        activitieId: this.activitieId,
        sprintId: this.sprintId,
        updates: this.activitieToSubmit
      });
      this.$emit("close");
    }
  },
  mounted() {
    this.activitieToSubmit = Object.assign({}, this.activitie);
  }
};
</script>
