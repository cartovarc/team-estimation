<template>
  <q-card>
    <modal-header>Edit sprint</modal-header>
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
import { mapActions } from "vuex";
import addEditSprintMixin from "src/mixins/mixin-add-edit-model.js";

export default {
  mixins: [addEditSprintMixin],
  props: ["sprint", "id"],
  data() {
    return {
      sprintToSubmit: {}
    };
  },
  methods: {
    ...mapActions("sprints", ["updateSprint"]),
    submitModel() {
      this.updateSprint({
        id: this.id,
        updates: this.sprintToSubmit
      });
      this.$emit("close");
    }
  },
  mounted() {
    this.sprintToSubmit = Object.assign({}, this.sprint);
  }
};
</script>
