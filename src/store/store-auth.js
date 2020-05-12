import { firebaseAuth, firebase, firebaseDb } from "boot/firebase";
import { Loading, LocalStorage, Notify } from "quasar";
import { showErrorMessage } from "src/functions/function-show-error-message";
import Vue from "vue";

const enterpriseId = "SERNA";

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
        if (newUser) {
          dispatch("fbNewUser", response);
        }
      })
      .catch(error => {
        showErrorMessage(error.message);
      });
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
        dispatch("sprints/fbReadData", null, { root: true });
        dispatch("fbReadData");
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
    console.log(payload);
    let uid = payload.user.uid;
    let imageUrlRef = firebaseDb.ref(
      "profiles/" + enterpriseId + "/" + uid + "/"
    );
    imageUrlRef.update(
      {
        imageURL: payload.additionalUserInfo.profile.picture,
        name: payload.additionalUserInfo.profile.name
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

  fbReadData({ commit }) {
    let profiles = firebaseDb.ref("profiles/" + enterpriseId);

    // child added
    profiles.on("child_added", snapshot => {
      let profile = snapshot.val();
      let payload = {
        id: snapshot.key,
        profile: profile
      };
      commit("addProfile", payload);
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
