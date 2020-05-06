<template>
  <q-card>
    <modal-header>Add sprint</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalSprintName"
          assignedRef="sprintName"
          label="Sprint name"
          :name.sync="sprintToSubmit.name"
        />
        <modal-due-date
          @clear="clearDueDate"
          :dueDate.sync="sprintToSubmit.dueDate"
        />
        <modal-due-time
          v-show="sprintToSubmit.dueDate"
          :dueTime.sync="sprintToSubmit.dueTime"
        />
      </q-card-section>
      <modal-buttons></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import addEditSprintMixin from "src/mixins/mixin-add-edit-sprint.js";

export default {
  mixins: [addEditSprintMixin],
  data() {
    return {
      sprintToSubmit: {
        name: "",
        dueDate: "",
        dueTime: "",
        completed: false
      }
    };
  },
  methods: {
    ...mapActions("sprints", ["addSprint"]),
    submitForm() {
      this.$refs.modalSprintName.$refs.sprintName.validate();
      if (!this.$refs.modalSprintName.$refs.sprintName.hasError) {
        this.submitSprint();
      }
    },
    submitSprint() {
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
