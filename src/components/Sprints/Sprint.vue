<template>
  <q-item v-ripple v-touch-hold:1000.mouse="showEditSprintModal">
    <q-item-section>
      <q-item-label v-if="$q.screen.gt.xs">
        {{ sprint.name | removeExtra }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row">
        <div v-if="!$q.screen.gt.xs" class="colum" style="min-width: 300px">
          <q-item-label class="row justify-start text-white q-mr-md">
            {{ sprint.name | removeExtra }}
          </q-item-label>
        </div>
        <div class="colum">
          <q-item-label class="row justify-end text-white" caption>
            {{ sprint.dueDate | niceDate }}
          </q-item-label>
          <q-item-label class="row justify-end text-white" caption>
            <small>
              {{ sprint.dueTime | niceTime }}
            </small>
          </q-item-label>
        </div>
        <div class="colum justify-center text-white">
          <q-icon name="event" size="18px" class="q-ml-xs" />
        </div>
      </div>
    </q-item-section>

    <q-item-section style="min-width: 80px" side>
      <div class="row">
        <q-btn
          @click.stop="showAddActivityModal"
          size="xs"
          round
          dense
          color="green"
          icon="add"
        />
        <q-btn
          @click.stop="showEditSprintModal"
          size="xs"
          round
          dense
          color="blue-5"
          icon="edit"
        />
        <q-btn
          @click.stop="promptToDelete(id)"
          size="xs"
          round
          dense
          color="red"
          icon="delete"
        />
      </div>
    </q-item-section>

    <q-dialog v-model="showEditSprint">
      <edit-sprint @close="showEditSprint = false" :sprint="sprint" :id="id" />
    </q-dialog>

    <q-dialog v-model="showAddActivity">
      <add-activitie @close="showAddActivity = false" :sprintId="id" />
    </q-dialog>
  </q-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { date } from "quasar";
const { formatDate } = date;

export default {
  props: ["sprint", "id"],
  data() {
    return {
      showEditSprint: false,
      showAddSprint: false,
      showAddActivity: false
    };
  },
  computed: {
    ...mapState("sprints", ["search"])
  },
  methods: {
    ...mapActions("sprints", ["updateSprint", "deleteSprint"]),
    promptToDelete(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteSprint(id);
        });
    },
    showEditSprintModal() {
      this.showEditSprint = true;
    },
    showAddSprintModal() {
      this.showAddSprint = true;
    },
    showAddActivityModal() {
      this.showAddActivity = true;
    }
  },
  filters: {
    niceDate(value) {
      if (!value) {
        return "- - -, - - - - - - -";
      }
      return date.formatDate(value, "ddd, D MMM YYYY");
    },
    niceTime(value) {
      if (!value) {
        return "- - : - -";
      }
      return value;
    },
    removeExtra(value) {
      if (value.length > 20) {
        return value.substring(0, 20) + "...";
      }
      return value;
    }
  },
  components: {
    "edit-sprint": require("components/Sprints/Modals/EditSprint.vue").default,
    "add-activitie": require("components/Activities/Modals/AddActivity.vue")
      .default
  }
};
</script>
