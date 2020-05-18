<template>
  <span>
    <q-select
      filled
      class="full-width"
      v-model="selection"
      multiple
      :options="acceptedUsers"
      use-chips
      stack-label
      :label="'Members of ' + project.name"
    >
      <template v-slot:after>
        <q-btn
          @click="showPermissionsModal = true"
          dense
          color="primary"
          icon="settings"
        />
      </template>
      <template v-slot:selected-item="scope">
        <q-chip
          dense
          color="white"
          text-color="primary"
          class="q-my-none q-ml-xs q-mr-none"
        >
          <q-avatar>
            <img :src="scope.opt.imageURL" />
          </q-avatar>
          <span class="text-caption">
            {{ scope.opt.label }}
          </span>
        </q-chip>
      </template>
    </q-select>
    <q-dialog v-model="showPermissionsModal">
      <permissions />
    </q-dialog>
  </span>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  props: ["project", "projectId"],

  data() {
    return {
      showPermissionsModal: false
    };
  },

  computed: {
    ...mapState("organizations", ["selectedOrganization", "organizations"]),
    ...mapState("auth", ["profiles"]),
    ...mapState("members", ["members"]),

    selection: {
      get() {
        return this.members[this.projectId];
      },
      set(value) {
        this.updateMembers({ id: this.projectId, selectedMembers: value });
      }
    },

    acceptedUsers() {
      if (this.organizations[this.selectedOrganization]) {
        return Object.keys(
          this.organizations[this.selectedOrganization].users
        ).map(uid => {
          let profile = this.profiles[uid];
          return {
            label: profile.name,
            value: uid,
            imageURL: profile.imageURL
          };
        });
      } else {
        return [];
      }
    }
  },
  methods: {
    ...mapActions("members", ["updateMembers"])
  },
  components: {
    permissions: require("components/Organizations/Modals/Permissions.vue")
      .default
  }
};
</script>

<style scoped></style>
