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
    Object.assign(state.activities[payload.id], payload.updates);
  },
  deleteActivity(state, id) {
    Vue.delete(state.activities, id);
  },
  addActivitie(state, payload) {
    Vue.set(state.activities, payload.id, payload.activitie);
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

  fbReadData({ commit, getters }) {
    let enterpriseActivities = firebaseDb.ref("activities/" + enterpriseId);

    // check initial data
    enterpriseActivities.once(
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
    enterpriseActivities.on("child_added", snapshot => {
      let activitie = snapshot.val();
      let payload = {
        id: snapshot.key,
        activitie: activitie
      };
      commit("addActivitie", payload);
    });

    // child changed
    enterpriseActivities.on("child_changed", snapshot => {
      let activitie = snapshot.val();
      let payload = {
        id: snapshot.key,
        updates: activitie
      };
      commit("updateActivity", payload);
    });

    // child removed
    enterpriseActivities.on("child_removed", snapshot => {
      let activitieId = snapshot.key;
      commit("deleteActivity", activitieId);
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
