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
          <q-item-section v-if="isOwner" side>
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

      <q-banner
        v-if="!unacceptedOrganizations.length"
        inline-actions
        rounded
        class="bg-grey text-white"
      >
        You dont have any organization invitation.
      </q-banner>

      <q-list
        v-if="unacceptedOrganizations.length"
        bordered
        padding
        class="rounded-borders"
      >
        <q-item
          v-for="unacceptedOrganization in unacceptedOrganizations"
          v-bind:key="unacceptedOrganization.id"
        >
          <q-item-section avatar>
            <q-avatar icon="home_work" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{
              unacceptedOrganization.id
            }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              @click="acceptInvitation(unacceptedOrganization.id)"
              dense
              color="green"
              icon="check_circle"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn
              @click="cancelInvitation(null, unacceptedOrganization.id)"
              dense
              color="red"
              icon="cancel"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <template v-if="isOwner">
        <q-item-label caption lines="1"
          >Sent invitations of {{ selectedOrganization }}</q-item-label
        >

        <q-banner
          v-if="!sentInvitations.length"
          inline-actions
          rounded
          class="bg-grey text-white"
        >
          No invitations sent
        </q-banner>

        <q-list v-else bordered separator padding class="rounded-borders">
          <template v-for="uid in sentInvitations">
            <q-item v-bind:key="uid">
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="
                      profiles[uid]
                        ? profiles[uid].imageURL
                        : 'https://static.thenounproject.com/png/574704-200.png'
                    "
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{
                  profiles[uid] ? profiles[uid].name : "Unknown"
                }}</q-item-label>
                <q-item-label caption>
                  <q-badge class="q-ml-xs" label="Pending" />
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  @click="cancelInvitation(uid)"
                  dense
                  icon="cancel"
                  color="red"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </template>

      <template v-if="selectedOrganization">
        <q-item-label caption
          >Team members of {{ selectedOrganization }}</q-item-label
        >

        <q-list bordered separator padding class="rounded-borders">
          <template v-for="(isMember, uid) in acceptedUsers">
            <q-item v-if="isMember" v-bind:key="uid">
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="
                      profiles[uid]
                        ? profiles[uid].imageURL
                        : 'https://static.thenounproject.com/png/574704-200.png'
                    "
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{
                  profiles[uid] ? profiles[uid].name : "Unknown"
                }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">Email:</span>
                  {{ profiles[uid] ? profiles[uid].email : "Unknown" }}
                </q-item-label>
              </q-item-section>

              <q-item-section
                v-if="organizations[selectedOrganization].info.owner != uid"
                side
              >
                <q-btn
                  v-if="isOwner"
                  @click="cancelInvitation(uid)"
                  dense
                  class="q-mb-xs"
                  color="red"
                  icon="delete"
                />
              </q-item-section>

              <q-item-section v-else side top>
                Owner
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </template>

      <q-item-label caption
        >Projects permissions of {{ selectedOrganization }}</q-item-label
      >

      <projects-permissions />
    </div>

    <q-dialog v-model="showInvite">
      <invite @close="showInvite = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { firebaseAuth } from "boot/firebase";

export default {
  computed: {
    ...mapGetters("organizations", ["organizations", "selectedOrganization"]),
    ...mapState("auth", ["profiles"]),
    organizationsArray() {
      let uid = "";

      if (firebaseAuth.currentUser) {
        uid = firebaseAuth.currentUser.uid;
      }

      let thisAux = this;
      return Object.keys(this.organizations)
        .map(function(organizationId) {
          return {
            organization: thisAux.organizations[organizationId],
            organizationId: organizationId
          };
        })
        .filter(payload => {
          if (!payload.organization) {
            return false;
          }
          return payload.organization.users[uid] == true;
        })
        .map(payload => {
          return {
            label: payload.organizationId,
            value: payload.organizationId
          };
        });
    },
    unacceptedOrganizations() {
      let thisAux = this;
      let uid = "";

      if (firebaseAuth.currentUser) {
        uid = firebaseAuth.currentUser.uid;
      }

      return Object.keys(this.organizations)
        .map(function(organizationId) {
          return {
            organization: thisAux.organizations[organizationId],
            id: organizationId
          };
        })
        .filter(value => {
          return value.organization.users[uid] == false;
        });
    },
    acceptedUsers() {
      if (this.organizations[this.selectedOrganization]) {
        return this.organizations[this.selectedOrganization].users;
      } else {
        return [];
      }
    },
    sentInvitations() {
      if (this.organizations[this.selectedOrganization]) {
        return Object.keys(
          this.organizations[this.selectedOrganization].users
        ).filter(uid => {
          return !this.organizations[this.selectedOrganization].users[uid];
        });
      } else {
        return [];
      }
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
      return (
        firebaseAuth.currentUser &&
        this.organizations &&
        this.selectedOrganization &&
        this.organizations[this.selectedOrganization] &&
        this.organizations[this.selectedOrganization].info &&
        this.organizations[this.selectedOrganization].info.owner ==
          firebaseAuth.currentUser.uid
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
      "updateSelectedOrganization",
      "cancelInvite",
      "acceptInvitate"
    ]),
    submitOrganization() {
      this.$refs.organizationInput.validate();
      if (!this.$refs.organizationInput.hasError) {
        this.addOrganization(this.organizationToSubmit);
        this.organizationToSubmit = { name: "" };
        this.$refs.organizationInput.resetValidation();
      }
    },
    cancelInvitation(uid, organization = null) {
      if (organization) {
        let uid = "";

        if (firebaseAuth.currentUser) {
          uid = firebaseAuth.currentUser.uid;
        }
        this.cancelInvite({
          uid: uid,
          organization: organization
        });
      } else {
        this.cancelInvite({
          uid: uid,
          organization: this.selectedOrganization
        });
      }
    },
    acceptInvitation(organizationId) {
      let uid = "";

      if (firebaseAuth.currentUser) {
        uid = firebaseAuth.currentUser.uid;
      }
      this.acceptInvitate({ uid: uid, organization: organizationId });
    }
  },
  components: {
    invite: require("src/components/Organizations/Modals/Invite.vue").default,
    "projects-permissions": require("src/components/Organizations/ProjectsPermissions.vue")
      .default
  }
};
</script>

<style></style>
