<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title
          :class="{ 'absolute-center': $q.screen.gt.xs || !loggedIn }"
        >
          Estimation
        </q-toolbar-title>
        <q-btn
          @click="logout"
          v-if="loggedIn"
          class="absolute-right"
          label="Logout"
          flat
        >
          <q-avatar class="q-ml-sm">
            <img
              style="max-width: 32px; max-height: 32px"
              :src="photoURL"
            /> </q-avatar
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-tabs v-if="loggedIn">
        <q-route-tab
          v-for="link in navLinks"
          :key="link.title"
          :icon="link.icon"
          :label="link.title"
          :to="link.to"
        />
      </q-tabs>
      <q-tabs v-else>
        <q-route-tab icon="help" label="Help" to="Help"/>
        <q-route-tab icon="email" label="Contact" to="Contact"
      /></q-tabs>
    </q-footer>

    <q-drawer
      v-if="loggedIn"
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      show-if-above
      bordered
      content-class="bg-primary"
    >
      <q-list dark>
        <q-item-label header>
          Navigation
        </q-item-label>
        <NavLink v-for="link in navLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import NavLink from "components/NavLink";
import { mapState } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "MainLayout",

  components: {
    NavLink
  },

  computed: {
    ...mapState("auth", ["loggedIn", "photoURL"])
  },
  data() {
    return {
      leftDrawerOpen: false,
      navLinks: [
        {
          title: "Backlogs",
          caption:
            "Add sprints, add activities, make activities estimations, assign activities as completed and report their real time of completion",
          icon: "event",
          to: "/"
        },
        {
          title: "Results",
          caption: "See estimations from all users",
          icon: "description",
          to: "/estimations"
        }
        //{
        //  title: "Settings",
        //  caption: "Configurations and parameters",
        //  icon: "settings",
        //   to: "/settings"
        // }
      ]
    };
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    logout() {
      this.logoutUser();
    },
    mounted() {
      console.log(this.photoURL);
    }
  }
};
</script>

<style lang="scss">
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}

.q-drawer {
  .q-router-link--exact-active {
    color: white !important;
  }
}
</style>
