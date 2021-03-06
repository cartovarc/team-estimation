import Vue from "vue";
import { uid, Notify } from "quasar";
import { firebaseDb, firebaseAuth } from "boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  projects: {},
  globalSelectedProject: {},
  projectsDownloaded: false,
  selectedOrganization: ""
};

const mutations = {
  updateProject(state, payload) {
    Object.assign(state.projects[payload.id], payload.updates);
  },
  deleteProject(state, ids) {
    Vue.delete(state.projects, ids.id);
  },
  addProject(state, payload) {
    Vue.set(state.projects, payload.id, payload.project);
  },
  clearProjects(state) {
    state.projects = {};
  },
  setProjectsDownloaded(state, value) {
    state.projectsDownloaded = value;
  },
  setSelectedSelectedProject(state, value) {
    state.globalSelectedProject = value;
  },
  updateSelectedOrganization(state, value) {
    state.selectedOrganization = value;
  }
};

const actions = {
  updateProject({ dispatch }, payload) {
    dispatch("fbUpdateProject", payload);
  },

  deleteProject({ dispatch }, id) {
    dispatch("fbDeleteProject", id);
  },

  addProject({ dispatch }, payload) {
    let newProjectId = uid();

    dispatch("fbAddProject", {
      id: newProjectId,
      project: payload.project
    });
  },
  clearProjects({ commit }) {
    commit("clearProjects");
  },

  setProjectsDownloaded({ commit }, value) {
    commit("setProjectsDownloaded", value);
  },

  setSelectedProject({ commit }, value) {
    commit("setSelectedSelectedProject", value);
  },

  updateSelectedOrganization({ commit }, value) {
    commit("updateSelectedOrganization", value);
  },

  fbReadData({ commit, state }) {
    let enterpriseProjects = firebaseDb.ref(
      "projects/" + state.selectedOrganization
    );

    // check initial data
    enterpriseProjects.once(
      "value",
      snapshot => {
        commit("setProjectsDownloaded", true);
      },
      error => {
        showErrorMessage(error.message);
      }
    );

    // child added
    enterpriseProjects.on("child_added", snapshot => {
      let project = snapshot.val();
      let payload = {
        id: snapshot.key,
        project: project
      };
      commit("addProject", payload);
    });

    // child changed
    enterpriseProjects.on("child_changed", snapshot => {
      let project = snapshot.val();
      let payload = {
        id: snapshot.key,
        updates: project
      };
      commit("updateProject", payload);
    });

    // child removed
    enterpriseProjects.on("child_removed", snapshot => {
      let projectId = snapshot.key;
      commit("deleteProject", {
        id: projectId
      });
    });
  },

  fbAddProject({ state }, payload) {
    let projectRef = firebaseDb.ref(
      "projects/" + state.selectedOrganization + "/" + payload.id
    );
    projectRef.set(payload.project, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Project added");
      }
    });
  },

  fbUpdateProject({ state }, payload) {
    let projectRef = firebaseDb.ref(
      "projects/" + state.selectedOrganization + "/" + payload.id
    );
    projectRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Project updated");
      }
    });
  },

  fbDeleteProject({ state }, id) {
    let projectRef = firebaseDb.ref(
      "projects/" + state.selectedOrganization + "/" + id
    );
    projectRef.remove(error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Project deleted");
      }
    });
  }
};

const getters = {
  projects: state => {
    return state.projects;
  },
  firstProject: state => {
    try {
      let res = {
        value: Object.keys(state.projects)[0],
        label: Object.values(state.projects)[0].name
      };
      return res;
    } catch (error) {
      return { label: "No selected", value: null };
    }
  },
  getProject: state => id => {
    try {
      let res = {
        value: id,
        label: state.projects[id].name
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
