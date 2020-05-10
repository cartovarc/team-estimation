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
        <div class="q-mb-sm">
          <q-input
            v-model="estimationToSubmit.estimatedHours"
            outlined
            :rules="[val => !!val || 'Field is required']"
            clearable
            clear-icon="close"
            ref="modalEstimatedHours"
            label="Estimated hours"
            type="number"
            style="max-width: 200px"
          />
        </div>
        <div class="q-mb-sm">
          <q-input
            v-model="estimationToSubmit.estimatedHoursWithUnforeseen"
            outlined
            :rules="[
              val => !!val || 'Field is required',
              val =>
                val <= estimationToSubmit.estimatedHours ||
                'This field must be lower or equal than estimated hours'
            ]"
            clearable
            clear-icon="close"
            ref="estimatedHoursWithUnforeseen"
            label="E. H. with Unforeseen"
            type="number"
            style="max-width: 200px"
          />
        </div>
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
      this.$refs.modalEstimatedHours.validate();
      this.$refs.estimatedHoursWithUnforeseen.validate();

      if (
        !this.$refs.modalEffort.$refs.number.hasError &&
        !this.$refs.modalEstimatedHours.hasError &&
        !this.$refs.estimatedHoursWithUnforeseen.hasError
      ) {
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
