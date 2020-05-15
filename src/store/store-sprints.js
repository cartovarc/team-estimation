import Vue from "vue";
import { uid, Notify, date } from "quasar";
import { firebaseDb } from "boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  sprints: {},
  sprintsDownloaded: false,
  selectedOrganization: ""
};

const mutations = {
  updateSprint(state, payload) {
    Object.assign(state.sprints[payload.id], payload.updates);
  },
  deleteSprint(state, id) {
    Vue.delete(state.sprints, id);
  },
  addSprint(state, payload) {
    Vue.set(state.sprints, payload.id, payload.sprint);
  },
  clearSprints(state) {
    state.sprints = {};
    state.sprintsDownloaded = false;
  },
  setSprintsDownloaded(state, value) {
    state.sprintsDownloaded = value;
  },
  updateSelectedOrganization(state, value) {
    state.selectedOrganization = value;
  }
};

const actions = {
  updateSprint({ dispatch }, payload) {
    dispatch("fbUpdateSprint", payload);
  },

  deleteSprint({ dispatch }, id) {
    dispatch("fbDeleteSprint", id);
  },

  updateSelectedOrganization({ commit }, value) {
    commit("updateSelectedOrganization", value);
  },

  addSprint({ dispatch }, sprint) {
    let id = uid();
    let payload = {
      id: id,
      sprint: sprint
    };
    dispatch("fbAddSprint", payload);
  },

  clearSprints({ commit }) {
    commit("clearSprints");
  },

  setSprintsDownloaded({ commit }, value) {
    commit("setSprintsDownloaded", value);
  },

  fbReadData({ commit, dispatch, state }) {
    let enterpriseSprints = firebaseDb.ref(
      "sprints/" + state.selectedOrganization
    );

    // check initial data
    enterpriseSprints.once(
      "value",
      snapshot => {
        commit("setSprintsDownloaded", true);
      },
      error => {
        showErrorMessage(error.message);
        // this.$router.replace('/auth');
      }
    );

    // child added
    enterpriseSprints.on("child_added", snapshot => {
      let sprint = snapshot.val();
      let payload = {
        id: snapshot.key,
        sprint: sprint
      };
      commit("addSprint", payload);
      dispatch("activities/fbReadData", snapshot.key, { root: true });
    });

    // child changed
    enterpriseSprints.on("child_changed", snapshot => {
      let sprint = snapshot.val();
      let payload = {
        id: snapshot.key,
        updates: sprint
      };
      commit("updateSprint", payload);
    });

    // child removed
    enterpriseSprints.on("child_removed", snapshot => {
      let sprintId = snapshot.key;
      commit("deleteSprint", sprintId);
    });
  },

  fbAddSprint({ state }, payload) {
    let sprintRef = firebaseDb.ref(
      "sprints/" + state.selectedOrganization + "/" + payload.id
    );
    sprintRef.set(payload.sprint, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint added");
      }
    });
  },

  fbUpdateSprint({ state }, payload) {
    let sprintRef = firebaseDb.ref(
      "sprints/" + state.selectedOrganization + "/" + payload.id
    );
    sprintRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint updated");
      }
    });
  },

  fbDeleteSprint({ state }, sprintId) {
    let sprintRef = firebaseDb.ref(
      "sprints/" + state.selectedOrganization + "/" + sprintId
    );
    sprintRef.remove(error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint deleted");
      }
    });
  }
};

const getters = {
  sprints: state => {
    let sprintSorted = {},
      keysOrdered = Object.keys(state.sprints);

    keysOrdered.sort((a, b) => {
      let sprintAProp = state.sprints[a]["dueDate"];
      let sprintBProp = state.sprints[b]["dueDate"];

      let date1 = new Date(sprintAProp);
      let date2 = new Date(sprintBProp);
      let unit = "days";

      let diff = date.getDateDiff(date2, date1, unit);

      if (diff < 0) return 1;
      else if (diff > 0) return -1;
      else return 0;
    });

    keysOrdered.forEach(key => {
      sprintSorted[key] = state.sprints[key];
    });
    return sprintSorted;
  },
  firstSprint: state => {
    try {
      let res = {
        value: Object.keys(state.sprints)[0],
        label: Object.values(state.sprints)[0].name
      };
      return res;
    } catch (error) {
      return { label: "retrieving data", value: null };
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
