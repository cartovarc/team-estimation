<template>
  <q-card>
    <modal-header>Complete activity</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-number
          :autofocus="true"
          ref="modalRealTime"
          label="Real hours time"
          :number.sync="activityToSubmit.realTime"
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
      activityToSubmit: {}
    };
  },
  methods: {
    ...mapActions("activities", ["updateActivity"]),
    submitForm() {
      this.$refs.modalRealTime.$refs.number.validate();
      if (!this.$refs.modalRealTime.$refs.number.hasError) {
        this.submitModel();
      }
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
      userCompleted: firebaseAuth.currentUser.uid,
      userUncompleted: null,
      completed: true
    };
  },
  components: {
    "modal-number": require("components/Shared/Modals/ModalNumber.vue").default
  }
};
</script>
