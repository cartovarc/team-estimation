<template>
  <q-card>
    <modal-header>Add sprint</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
          label="Sprint name"
          :name.sync="sprintToSubmit.name"
        />
      </q-card-section>
      <modal-buttons></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import addEditSprintMixin from "src/mixins/mixin-add-edit-model.js";

export default {
  mixins: [addEditSprintMixin],
  data() {
    return {
      sprintToSubmit: {
        name: "",
        dueDate: "",
        dueTime: ""
      }
    };
  },
  methods: {
    ...mapActions("sprints", ["addSprint"]),
    submitModel() {
      this.addSprint(this.sprintToSubmit);
      this.$emit("close");
    },
    clearDueDate() {
      this.sprintToSubmit.dueDate = "";
      this.sprintToSubmit.dueTime = "";
    }
  }
};
</script>
