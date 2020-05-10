<template>
  <q-card>
    <modal-header>Really not completed?</modal-header>
    <q-form @submit="submitForm()">
      <modal-buttons></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import { firebaseAuth } from "boot/firebase";
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
    submitForm() {
      this.submitModel();
    },
    submitModel() {
      this.updateActivity({
        id: this.activityId,
        updates: this.activityToSubmit
      });
      this.$emit("close");
    }
  },
  mounted() {
    this.activityToSubmit = {
      userUncompleted: firebaseAuth.currentUser.uid,
      userCompleted: null,
      realTime: null,
      completed: false
    };
  }
};
</script>
