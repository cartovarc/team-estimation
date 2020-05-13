<template>
  <q-card>
    <modal-header>Add sprint to {{ globalSelectedProject.label }}</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
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
import { mapActions, mapState } from "vuex";
import addEditSprintMixin from "src/mixins/mixin-add-edit-model.js";

export default {
  mixins: [addEditSprintMixin],
  computed: {
    ...mapState("projects", ["globalSelectedProject"])
  },
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
      this.sprintToSubmit["project"] = this.globalSelectedProject.value;
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
