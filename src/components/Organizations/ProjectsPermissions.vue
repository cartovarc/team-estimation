<template>
  <q-list bordered separator>
    <q-item v-for="(project, key) in projects" v-bind:key="key">
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
          <q-btn dense color="primary" icon="settings" />
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
    </q-item>
  </q-list>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("organizations", ["selectedOrganization", "organizations"]),
    ...mapState("auth", ["profiles"]),
    ...mapState("projects", ["projects"]),

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
  data() {
    return {
      selection: null,
      modelMultiple: ["Facebook"]
    };
  }
};
</script>

<style scoped></style>
