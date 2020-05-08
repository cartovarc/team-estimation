import Vue from "vue";
import { uid, Notify } from "quasar";
import { firebaseDb, firebaseAuth } from "boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

const enterpriseId = "SERNA";

const state = {
  activities: {},
  activitiesDownloaded: false
};

const mutations = {
  updateActivity(state, payload) {
    Object.assign(
      state.activities[payload.sprintId][payload.id],
      payload.updates
    );
  },
  deleteActivity(state, ids) {
    Vue.delete(state.activities[ids.sprintId], ids.id);
  },
  addActivity(state, payload) {
    if (!state.activities[payload.activitie.sprint]) {
      Vue.set(state.activities, payload.activitie.sprint, {});
    }
    Vue.set(
      state.activities[payload.activitie.sprint],
      payload.id,
      payload.activitie
    );
  },
  clearActivities(state) {
    state.activities = {};
  },
  setActivitiesDownloaded(state, value) {
    state.activitiesDownloaded = value;
  }
};

const actions = {
  updateActivity({ dispatch }, payload) {
    dispatch("fbUpdateActivity", payload);
  },

  updateEstimation({ dispatch }, payload) {
    dispatch("fbUpdateEstimation", payload);
  },

  deleteActivity({ dispatch }, id) {
    dispatch("fbDeleteActivity", id);
  },

  addActivity({ dispatch }, payload) {
    let newActivityId = uid();

    dispatch("fbAddActivity", {
      id: newActivityId,
      activity: payload.activity
    });
  },

  setActivitiesDownloaded({ commit }, value) {
    commit("setActivitiesDownloaded", value);
  },

  fbReadData({ commit }, sprintId) {
    let sprintActivities = firebaseDb
      .ref("activities/" + enterpriseId)
      .orderByChild("sprint")
      .equalTo(sprintId);

    // check initial data
    sprintActivities.once(
      "value",
      snapshot => {
        commit("setActivitiesDownloaded", true);
      },
      error => {
        showErrorMessage(error.message);
        // this.$router.replace('/auth');
      }
    );

    // child added
    sprintActivities.on("child_added", snapshot => {
      let activity = snapshot.val();
      let payload = {
        id: snapshot.key,
        activitie: activity
      };
      commit("addActivity", payload);
    });

    // child changed
    sprintActivities.on("child_changed", snapshot => {
      let activity = snapshot.val();
      let payload = {
        id: snapshot.key,
        sprintId: activity.sprint,
        updates: activity
      };
      commit("updateActivity", payload);
    });

    // child removed
    sprintActivities.on("child_removed", snapshot => {
      let activitieId = snapshot.key;
      let activity = snapshot.val();
      commit("deleteActivity", { id: activitieId, sprintId: activity.sprint });
    });
  },

  fbAddActivity({}, payload) {
    let activitieRef = firebaseDb.ref(
      "activities/" + enterpriseId + "/" + payload.id
    );
    activitieRef.set(payload.activity, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Activity added");
      }
    });
  },

  fbUpdateActivity({}, payload) {
    let activitieRef = firebaseDb.ref(
      "activities/" + enterpriseId + "/" + payload.id
    );
    activitieRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Activity updated");
      }
    });
  },

  fbUpdateEstimation({}, payload) {
    let estimationRef = firebaseDb.ref(
      "activities/" +
        enterpriseId +
        "/" +
        payload.id +
        "/estimations/" +
        payload.uid
    );

    estimationRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        // TODO: fix bug, needed for reactive in estimations pages
        let activityRef = firebaseDb.ref(
          "activities/" + enterpriseId + "/" + payload.id
        );
        activityRef.update({ lastChanged: Date.now() }, error => {
          if (error) {
            showErrorMessage(error.message);
          }
        });
        Notify.create("Estimation updated");
      }
    });
  },

  fbDeleteActivity({}, id) {
    let activityRef = firebaseDb.ref("activities/" + enterpriseId + "/" + id);
    activityRef.remove(error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Activity deleted");
      }
    });
  }
};

const getters = {
  activities: state => {
    return state.activities;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
