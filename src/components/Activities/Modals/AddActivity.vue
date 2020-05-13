<template>
  <q-card>
    <modal-header>Add activity to {{ sprint.name }} </modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
          label="Activity name"
          :name.sync="activityToSubmit.name"
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
  props: ["sprint", "sprintId"],
  data() {
    return {
      activityToSubmit: {
        name: "",
        completed: false,
        lastChanged: false
      }
    };
  },
  methods: {
    ...mapActions("activities", ["addActivity"]),
    submitModel() {
      this.activityToSubmit["sprint"] = this.sprintId;
      this.activityToSubmit["lastChanged"] = Date.now();

      this.addActivity({
        activity: this.activityToSubmit,
        sprintId: this.sprintId
      });
      this.$emit("close");
    }
  }
};
</script>
