<template>
  <q-card>
    <modal-header>Estimate activity</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-number
          :autofocus="true"
          ref="modalEffort"
          label="Effort (1 to 10)"
          :number.sync="estimationToSubmit.effort"
        />
        <modal-number
          ref="modalEstimatedHours"
          label="Estimated hours"
          :number.sync="estimationToSubmit.estimatedHours"
        />
        <modal-number
          ref="modalUnforeseenEstimatedHours"
          label="E. H. with Unforeseen"
          :number.sync="estimationToSubmit.estimatedHoursWithUnforeseen"
        />
      </q-card-section>
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
      estimationToSubmit: {}
    };
  },
  methods: {
    ...mapActions("activities", ["updateEstimation"]),
    submitForm() {
      this.$refs.modalEffort.$refs.number.validate();
      if (!this.$refs.modalEffort.$refs.number.hasError) {
        this.submitModel();
      }
    },
    submitModel() {
      let uid = firebaseAuth.currentUser.uid;
      this.updateEstimation({
        uid: uid,
        id: this.activityId,
        updates: this.estimationToSubmit
      });
      this.$emit("close");
    }
  },
  components: {
    "modal-number": require("components/Shared/Modals/ModalNumber.vue").default
  },
  mounted() {
    let uid = firebaseAuth.currentUser.uid;
    if (this.activity.estimations && this.activity.estimations[uid]) {
      this.estimationToSubmit = Object.assign(
        {},
        this.activity.estimations[uid]
      );
    }
  }
};
</script>
