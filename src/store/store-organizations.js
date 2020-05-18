import Vue from "vue";
import { Notify, Loading } from "quasar";
import { firebaseDb, firebaseAuth, firebaseFunctions } from "boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  organizations: {},
  selectedOrganization: "",
  organizationsDownloaded: false
};

const mutations = {
  addOrganization(state, payload) {
    Vue.set(state.organizations, payload.id, payload.organization);
  },
  clearOrganizations(state) {
    state.organizations = {};
  },
  updateSelectedOrganization(state, value) {
    state.selectedOrganization = value;
  }
};

const actions = {
  addOrganization({ dispatch }, organization) {
    let uid = firebaseAuth.currentUser.uid;
    let payload = {
      id: organization.name,
      organization: { info: { owner: uid }, users: {} }
    };
    payload.organization["users"][uid] = true;
    dispatch("fbAddOrganization", payload);
  },

  invite({ dispatch }, payload) {
    dispatch("fbInvite", payload);
  },

  cancelInvite({ dispatch }, payload) {
    dispatch("fbCancelInvite", payload);
  },

  acceptInvitate({ dispatch }, payload) {
    dispatch("fbAcceptInvitate", payload);
  },

  fbReadData({ commit, dispatch }) {
    let uid = firebaseAuth.currentUser.uid;
    let userOrganizations = firebaseDb.ref("users/" + uid + "/organizations");

    // child added
    userOrganizations.on("child_added", snapshot => {
      let organizationId = snapshot.key;

      let organizationRef = firebaseDb.ref("organizations/" + organizationId);
      organizationRef.on("value", snapshot => {
        commit("addOrganization", {
          id: organizationId,
          organization: snapshot.val()
        });
      });
    });

    let selectedOrganizationRef = firebaseDb.ref(
      "users/" + uid + "/selectedOrganization"
    );

    //child changed
    selectedOrganizationRef.on("value", snapshot => {
      let selectedOrganization = snapshot.val();
      commit("updateSelectedOrganization", selectedOrganization);
      dispatch("auth/fbReadData", selectedOrganization, { root: true });

      // update selected Organizations from all stores
      dispatch("sprints/updateSelectedOrganization", selectedOrganization, {
        root: true
      });
      dispatch("projects/updateSelectedOrganization", selectedOrganization, {
        root: true
      });

      dispatch("activities/updateSelectedOrganization", selectedOrganization, {
        root: true
      });

      dispatch("members/updateSelectedOrganization", selectedOrganization, {
        root: true
      });

      // clear all stores
      dispatch("auth/clearProfiles", null, { root: true });
      dispatch("projects/clearProjects", null, { root: true });
      dispatch("sprints/clearSprints", null, { root: true });
      dispatch("members/clearMembers", null, { root: true });

      // read data from all stores
      dispatch("auth/fbReadData", null, { root: true });
      dispatch("projects/fbReadData", null, { root: true });
      dispatch("sprints/fbReadData", null, { root: true });
      dispatch("members/fbReadData", null, { root: true });
    });
  },

  updateSelectedOrganization({ dispatch }, selectedOrganization) {
    dispatch("fbUpdateSelectedOrganization", selectedOrganization);
  },

  fbAddOrganization({ dispatch }, payload) {
    let uid = firebaseAuth.currentUser.uid;

    let organizationRef = firebaseDb.ref("organizations/" + payload.id);

    organizationRef.once(
      "value",
      snapshot => {
        if (snapshot.val()) {
          showErrorMessage("Organization already exists");
        } else {
          organizationRef.set(payload.organization, error => {
            if (error) {
              showErrorMessage(error.message);
            } else {
              let userRef = firebaseDb.ref("users/" + uid + "/organizations");
              let organization = {};
              (organization[payload.id] = true),
                dispatch("updateSelectedOrganization", payload.id);
              userRef.update(organization, error => {
                if (error) {
                  showErrorMessage(error.message);
                } else {
                  Notify.create("Organization added");
                }
              });
            }
          });
        }
      },
      error => {
        showErrorMessage(error.message);
      }
    );
  },

  async fbCancelInvite({}, payload) {
    Loading.show();

    let uid = payload.uid;

    let userOrganizationRef = firebaseDb.ref(
      "organizations/" + payload.organization + "/users/" + uid
    );

    userOrganizationRef.remove(error => {
      if (!error) {
        let userRef = firebaseDb.ref(
          "users/" + uid + "/organizations/" + payload.organization
        );

        userRef.remove(error => {
          if (error) {
            showErrorMessage(error.message);
          } else {
            Notify.create("Invitation canceled");
          }
        });
      } else {
        showErrorMessage(error.message);
      }
    });

    Loading.hide();
  },

  // put on fb cloud function
  async fbAcceptInvitate({ dispatch }, payload) {
    Loading.show();

    let uid = payload.uid;

    let userOrganizationRef = firebaseDb.ref(
      "organizations/" + payload.organization + "/users/" + uid
    );

    userOrganizationRef.set(true, error => {
      if (!error) {
        let userRef = firebaseDb.ref(
          "users/" + uid + "/organizations/" + payload.organization
        );

        userRef.set(true, error => {
          if (error) {
            showErrorMessage(error.message);
          } else {
            dispatch("fbUpdateSelectedOrganization", payload.organization);
            Notify.create("Invitation accepted");
          }
        });
      } else {
        showErrorMessage(error.message);
      }
    });

    Loading.hide();
  },

  fbUpdateSelectedOrganization({}, value) {
    let uid = firebaseAuth.currentUser.uid;

    let userRef = firebaseDb.ref("users/" + uid + "/selectedOrganization/");
    userRef.set(value, error => {
      if (error) {
        showErrorMessage(error.message);
      }
    });
  },

  async fbInvite({}, payload) {
    Loading.show();
    let getUser = firebaseFunctions.httpsCallable("getUser");
    let dataUser = {};
    try {
      dataUser = await getUser({ email: payload.email });
    } catch (error) {
      showErrorMessage("Email is not associated with an account");
    }
    let userRecord = dataUser.data;

    if (userRecord) {
      let uid = userRecord.uid;

      let userOrganizationRef = firebaseDb.ref(
        "organizations/" + payload.organization + "/users/" + uid
      );

      userOrganizationRef.set(false, error => {
        if (!error) {
          let userRef = firebaseDb.ref("users/" + uid + "/organizations");
          let organization = {};
          organization[payload.organization] = false;
          userRef.update(organization, error => {
            if (error) {
              showErrorMessage(error.message);
            } else {
              Notify.create("Invited");
            }
          });
        } else {
          showErrorMessage(error.message);
        }
      });
    }
    Loading.hide();
  }
};

const getters = {
  organizations: state => {
    return state.organizations;
  },
  selectedOrganization: state => {
    return state.selectedOrganization;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
