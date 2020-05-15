<template>
  <q-card>
    <modal-header>Invite to {{ selectedOrganization }}</modal-header>
    <q-form @submit="submitForm()">
      <q-card-section class="q-pt-none">
        <modal-model-name
          ref="modalModelName"
          label="Email"
          :name.sync="inviteToSubmit.email"
        />
      </q-card-section>
      <modal-buttons></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import addEditInviteMixin from "src/mixins/mixin-add-edit-model.js";

export default {
  mixins: [addEditInviteMixin],
  computed: {
    ...mapState("organizations", ["selectedOrganization"])
  },
  data() {
    return {
      inviteToSubmit: {
        email: ""
      }
    };
  },
  methods: {
    ...mapActions("organizations", ["invite"]),
    submitModel() {
      this.inviteToSubmit["organization"] = this.selectedOrganization;
      this.invite(this.inviteToSubmit);
      this.$emit("close");
    }
  }
};
</script>
