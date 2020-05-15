import { firebaseAuth, firebase, firebaseDb } from "boot/firebase";
import { Loading, LocalStorage, Notify } from "quasar";
import { showErrorMessage } from "src/functions/function-show-error-message";
import Vue from "vue";

const state = {
  loggedIn: false,
  profiles: {},
  photoURL: null
};

const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value;
  },
  addProfile(state, payload) {
    Vue.set(state.profiles, payload.id, payload.profile);
  },
  setPhotoURL(state, value) {
    state.photoURL = value;
  },
  clearProfiles(state) {
    state.profiles = {};
  }
};

const actions = {
  loginUser({ dispatch }) {
    Loading.show();
    let provider = new firebase.auth.GoogleAuthProvider();
    firebaseAuth
      .signInWithPopup(provider)
      .then(response => {
        let newUser = response.additionalUserInfo.isNewUser;
        if (newUser || true) {
          dispatch("fbNewUser", response);
        }
      })
      .catch(error => {
        showErrorMessage(error.message);
      });
  },
  clearProfiles({ commit }) {
    commit("clearProfiles");
  },
  logoutUser() {
    firebaseAuth.signOut();
  },
  handleAuthStateChanged({ commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(user => {
      Loading.hide();
      if (user) {
        commit("setLoggedIn", true);
        commit("setPhotoURL", user.photoURL);
        LocalStorage.set("loggedIn", true);
        this.$router.push("/").catch(err => {});
        dispatch("organizations/fbReadData", null, {
          root: true
        });
      } else {
        commit("sprints/clearSprints", null, { root: true });
        commit("sprints/setSprintsDownloaded", false, { root: true });
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        this.$router.replace("/auth").catch(err => {});
      }
    });
  },
  fbNewUser({}, payload) {
    let uid = payload.user.uid;
    let imageUrlRef = firebaseDb.ref("profiles/" + uid + "/");
    imageUrlRef.update(
      {
        imageURL: payload.additionalUserInfo.profile.picture,
        name: payload.additionalUserInfo.profile.name,
        email: payload.additionalUserInfo.profile.email
      },
      error => {
        Loading.hide();
        if (error) {
          showErrorMessage(error.message);
        } else {
          Notify.create("Welcome");
        }
      }
    );
  },

  fbReadData({ commit }, selectedOrganization) {
    commit("clearProfiles");
    let organizationUsers = firebaseDb.ref(
      "organizations/" + selectedOrganization + "/users"
    );

    // child added
    organizationUsers.on("child_added", snapshot => {
      let userId = snapshot.key;
      let profile = firebaseDb.ref("profiles/" + userId);

      profile.once("value", snapshot => {
        let payload = {
          id: snapshot.key,
          profile: snapshot.val()
        };
        commit("addProfile", payload);
      });
    });
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
