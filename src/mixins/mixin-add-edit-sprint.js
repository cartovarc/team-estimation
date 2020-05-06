export default {
  methods: {
    submitForm() {
      this.$refs.modalSprintName.$refs.sprintName.validate();
      if (!this.$refs.modalSprintName.$refs.sprintName.hasError) {
        this.submitSprint();
      }
    },
    clearDueDate() {
      this.sprintToSubmit.dueDate = "";
      this.sprintToSubmit.dueTime = "";
    }
  },
  components: {
    "modal-header": require("components/Sprints/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-sprint-name": require("components/Sprints/Modals/Shared/ModalSprintName.vue")
      .default,
    "modal-due-date": require("components/Sprints/Modals/Shared/ModalDueDate.vue")
      .default,
    "modal-due-time": require("components/Sprints/Modals/Shared/ModalDueTime.vue")
      .default,
    "modal-buttons": require("components/Sprints/Modals/Shared/ModalButtons.vue")
      .default
  }
};
