<template>
  <q-card>
    <modal-header>Edit activity</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
          label="Activitie name"
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
  props: ["activity", "activityId"],
  data() {
    return {
      activityToSubmit: {}
    };
  },
  methods: {
    ...mapActions("activities", ["updateActivity"]),
    submitModel() {
      this.updateActivity({
        id: this.activityId,
        updates: this.activityToSubmit
      });
      this.$emit("close");
    }
  },
  mounted() {
    this.activityToSubmit = Object.assign({}, this.activity);
  }
};
</script>
