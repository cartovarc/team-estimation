<template>
  <q-page padding>
    <div class="q-gutter-md q-pa-md">
      <q-item-label caption>Create new organization</q-item-label>

      <q-list bordered padding class="rounded-borders">
        <q-item>
          <q-item-section>
            <q-input
              lazy-rules
              ref="organizationInput"
              v-model="organizationToSubmit.name"
              :rules="[
                val =>
                  (val && val.length >= 6) ||
                  'Please enter at least 6 characters ',
                val =>
                  val.match(/^[\w\.@]{6,100}$/) ||
                  'Please enter a valid organization name'
              ]"
              label="New organization name"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn
              @click="submitOrganization"
              style="min-width: 80px"
              color="green"
              label="New"
            />
          </q-item-section>
        </q-item>

        <q-item v-if="false">
          <span class="text-red"
            >Upgrade to create your own organizations
          </span>
        </q-item>
      </q-list>

      <q-item-label caption>Current working organization</q-item-label>
      <q-list bordered padding class="rounded-borders">
        <q-item>
          <q-item-section>
            <q-select
              :disable="workingOrganization == 'No organizations found'"
              v-model="workingOrganization"
              :options="organizationsArray"
              label="Working organization"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click="showInvite = true"
              :disable="workingOrganization == 'No organizations found'"
              style="min-width: 80px"
              color="primary"
              label="Invite"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-item-label caption>Organizations invitations</q-item-label>
      <q-list bordered padding class="rounded-borders">
        <q-item>
          <q-item-section avatar>
            <q-avatar icon="home_work" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">DANALYTICS</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn dense color="green" icon="check_circle" />
          </q-item-section>

          <q-item-section side>
            <q-btn dense color="red" icon="cancel" />
          </q-item-section>
        </q-item>
      </q-list>

      <template v-if="isOwner">
        <q-item-label caption lines="1"
          >Sent invitations of {{ selectedOrganization }}</q-item-label
        >

        <q-list bordered padding class="rounded-borders">
          <q-item>
            <q-item-section avatar>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label>cartovarc@gmail.com</q-item-label>
              <q-item-label caption>
                <q-badge class="q-ml-xs" label="Pending" />
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn dense icon="cancel" color="red" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-item-label caption
          >Team members of {{ selectedOrganization }}</q-item-label
        >

        <q-list bordered padding class="rounded-borders">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Carlos Tovar</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">Email:</span>
                cartovarc@gmail.com
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn dense class="q-mb-xs" color="red" icon="delete" />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </div>

    <q-dialog v-model="showInvite">
      <invite @close="showInvite = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { firebaseAuth } from "boot/firebase";

export default {
  computed: {
    ...mapGetters("organizations", ["organizations", "selectedOrganization"]),
    organizationsArray() {
      let thisAux = this;
      return Object.keys(this.organizations).map(function(organizationId) {
        return {
          label: organizationId,
          value: organizationId
        };
      });
    },
    workingOrganization: {
      get() {
        if (!this.selectedOrganization) {
          return "No organizations found";
        }
        return this.selectedOrganization;
      },
      set(value) {
        this.updateSelectedOrganization(value.value);
      }
    },
    isOwner() {
      let uid = firebaseAuth.currentUser.uid;
      return (
        this.organizations &&
        this.selectedOrganization &&
        this.organizations[this.selectedOrganization] &&
        this.organizations[this.selectedOrganization].info &&
        this.organizations[this.selectedOrganization].info.owner == uid
      );
    }
  },
  data() {
    return {
      organizationToSubmit: {
        name: ""
      },
      showInvite: false
    };
  },
  methods: {
    ...mapActions("organizations", [
      "addOrganization",
      "updateSelectedOrganization"
    ]),
    submitOrganization() {
      this.$refs.organizationInput.validate();
      if (!this.$refs.organizationInput.hasError) {
        this.addOrganization(this.organizationToSubmit);
        this.organizationToSubmit = { name: "" };
        this.$refs.organizationInput.resetValidation();
      }
    }
  },
  components: {
    invite: require("src/components/Organizations/Modals/Invite.vue").default
  }
};
</script>

<style></style>
