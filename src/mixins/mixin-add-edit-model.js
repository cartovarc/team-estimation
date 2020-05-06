export default {
  methods: {
    submitForm() {
      this.$refs.modalModelName.$refs.modalName.validate();
      if (!this.$refs.modalModelName.$refs.modalName.hasError) {
        this.submitModel();
      }
    },
    clearDueDate() {
      this.sprintToSubmit.dueDate = "";
      this.sprintToSubmit.dueTime = "";
    }
  },
  components: {
    "modal-header": require("components/Shared/Modals/ModalHeader.vue").default,
    "modal-model-name": require("components/Shared/Modals/ModalModelName.vue")
      .default,
    "modal-due-date": require("components/Shared/Modals/ModalDueDate.vue")
      .default,
    "modal-due-time": require("components/Shared/Modals/ModalDueTime.vue")
      .default,
    "modal-buttons": require("components/Shared/Modals/ModalButtons.vue")
      .default
  }
};
