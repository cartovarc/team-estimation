import Vue from "vue";
import { uid, Notify } from "quasar";
import { firebaseDb, firebaseAuth } from "boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

const enterpriseId = "SERNA";

const state = {
  sprints: {},
  sprintsDownloaded: false
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
  },
  setSprintsDownloaded(state, value) {
    state.sprintsDownloaded = value;
  }
};

const actions = {
  updateSprint({ dispatch }, payload) {
    dispatch("fbUpdateSprint", payload);
  },

  updateActivitie({ dispatch }, payload) {
    dispatch("fbUpdateActivitie", payload);
  },

  deleteSprint({ dispatch }, id) {
    dispatch("fbDeleteSprint", id);
  },

  deleteActivitie({ dispatch }, ids) {
    dispatch("fbDeleteActivitie", ids);
  },

  addSprint({ dispatch }, sprint) {
    let id = uid();
    let payload = {
      id: id,
      sprint: sprint
    };
    dispatch("fbAddSprint", payload);
  },

  addActivitie({ dispatch }, payload) {
    let newActivitieId = uid();

    dispatch("fbAddActivitie", {
      id: newActivitieId,
      sprintId: payload.sprintId,
      activitie: payload.activitieToSubmit
    });
  },

  setSprintsDownloaded({ commit }, value) {
    commit("setSprintsDownloaded", value);
  },

  fbReadData({ commit, getters }) {
    let enterpriseSprints = firebaseDb.ref("sprints/" + enterpriseId);

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

  fbAddSprint({}, payload) {
    let sprintRef = firebaseDb.ref(
      "sprints/" + enterpriseId + "/" + payload.id
    );
    sprintRef.set(payload.sprint, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint added");
      }
    });
  },

  fbAddActivitie({}, payload) {
    let activitieRef = firebaseDb.ref(
      "sprints/" +
        enterpriseId +
        "/" +
        payload.sprintId +
        "/activities/" +
        payload.id
    );
    activitieRef.set(payload.activitie, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Activitie added");
      }
    });
  },

  fbUpdateSprint({}, payload) {
    let sprintRef = firebaseDb.ref(
      "sprints/" + enterpriseId + "/" + payload.id
    );
    sprintRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint updated");
      }
    });
  },

  fbUpdateActivitie({}, payload) {
    let activitieRef = firebaseDb.ref(
      "sprints/" +
        enterpriseId +
        "/" +
        payload.sprintId +
        "/activities/" +
        payload.activitieId
    );
    activitieRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint updated");
      }
    });
  },

  fbDeleteSprint({}, sprintId) {
    let sprintRef = firebaseDb.ref("sprints/" + enterpriseId + "/" + sprintId);
    sprintRef.remove(error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Sprint deleted");
      }
    });
  },
  fbDeleteActivitie({}, ids) {
    let activitieRef = firebaseDb.ref(
      "sprints/" +
        enterpriseId +
        "/" +
        ids.sprintId +
        "/activities/" +
        ids.activitieId
    );
    activitieRef.remove(error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Activitie deleted");
      }
    });
  }
};

const getters = {
  sprints: state => {
    return state.sprints;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
