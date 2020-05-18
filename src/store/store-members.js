import Vue from "vue";
import { Notify, Loading } from "quasar";
import { firebaseDb, firebaseAuth, firebaseFunctions } from "boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  members: {} // projects ids
};

const mutations = {
  updateMembers(state, payload) {
    Vue.delete(state.members, payload.id);
    Vue.set(state.members, payload.id, payload.selectedMembers);
  },
  updateSelectedOrganization(state, value) {
    state.selectedOrganization = value;
  },
  clearMembers(state) {
    state.members = {};
  }
};

const actions = {
  updateMembers({ dispatch }, payload) {
    dispatch("fbUpdateMembers", payload);
  },

  updateSelectedOrganization({ commit }, value) {
    commit("updateSelectedOrganization", value);
  },

  clearMembers({ commit }) {
    commit("clearMembers");
  },

  fbReadData({ commit, state }) {
    let organizationProjects = firebaseDb.ref(
      "projects/" + state.selectedOrganization
    );

    // child added
    organizationProjects.on("child_added", snapshot => {
      let projectId = snapshot.key;

      let projectMembersRef = firebaseDb.ref(
        "members/" + state.selectedOrganization + "/" + projectId
      );
      projectMembersRef.on("value", snapshot => {
        commit("updateMembers", {
          id: projectId,
          selectedMembers: snapshot.val()
        });
      });
    });
  },
  fbUpdateMembers({ state }, payload) {
    console.log(payload);
    let membersProjectRef = firebaseDb.ref(
      "members/" + state.selectedOrganization + "/" + payload.id
    );

    membersProjectRef.set(payload.selectedMembers, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Members updated");
      }
    });
  }
};

const getters = {
  members: state => {
    return state.members;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
