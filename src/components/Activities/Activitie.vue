<template>
  <q-item
    v-ripple
    v-touch-hold:1000.mouse="showEditActivityModal"
    @click="
      updateActivity({
        sprintId: activity.sprint,
        id: activityId,
        updates: { completed: !activity.completed }
      })
    "
    :class="getColor()"
    clickable
  >
    <q-item-section side top>
      <q-checkbox :value="activity.completed" class="no-pointer-events" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'text-strikethrough': activity.completed }">
        {{ activity.name }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="activity.dueDate" side>
      <div class="row">
        <div class="colum">
          <q-item-label class="row justify-end" caption>
            {{ activity.dueDate | niceDate }}
          </q-item-label>
          <q-item-label class="row justify-end" caption>
            <small>
              {{ activityDueTime }}
            </small>
          </q-item-label>
        </div>
        <div class="colum justify-center">
          <q-icon name="event" size="18px" class="q-ml-xs" />
        </div>
      </div>
    </q-item-section>

    <q-item-section side>
      <div class="row">
        <q-btn
          @click.stop="showEstimateModal"
          flat
          round
          dense
          color="orange-6"
          icon="schedule"
        />
        <q-btn
          @click.stop="showEditActivityModal"
          flat
          round
          dense
          color="primary"
          icon="edit"
        />
        <q-btn
          @click.stop="promptToDelete()"
          flat
          round
          dense
          color="red"
          icon="delete"
        />
      </div>
    </q-item-section>

    <q-dialog v-model="showEditActivity">
      <edit-activity
        @close="showEditActivity = false"
        :activity="activity"
        :activityId="activityId"
      />
    </q-dialog>

    <q-dialog v-model="showEstimateActivity">
      <estimate-activity
        @close="showEstimateActivity = false"
        :activity="activity"
        :activityId="activityId"
      />
    </q-dialog>
  </q-item>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { firebaseAuth } from "boot/firebase";
import { date } from "quasar";
const { formatDate } = date;

export default {
  props: ["activity", "activityId"],
  data() {
    return {
      showEditActivity: false,
      showEstimateActivity: false
    };
  },
  computed: {
    activityDueTime() {
      if (this.settings.show12HourTimeFormat) {
        return date.formatDate(
          this.activity.dueDate + " " + this.activity.dueTime,
          "h:mmA"
        );
      }
      return this.activity.dueTime;
    }
  },
  methods: {
    ...mapActions("activities", ["updateActivity", "deleteActivity"]),
    promptToDelete() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteActivity(this.activityId);
        });
    },
    showEditActivityModal() {
      this.showEditActivity = true;
    },
    showEstimateModal() {
      this.showEstimateActivity = true;
    },
    getColor() {
      let uid = firebaseAuth.currentUser.uid;
      let estimated =
        this.activity.estimations && this.activity.estimations[uid];
      if (!this.activity.completed && !estimated) {
        return "bg-red-2";
      } else if (!this.activity.completed || !estimated) {
        return "bg-amber-2";
      } else {
        return "bg-green-2";
      }
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, "ddd, D MMM YYYY");
    }
  },
  components: {
    "edit-activity": require("components/Activities/Modals/EditActivity.vue")
      .default,
    "estimate-activity": require("components/Activities/Modals/EstimateActivity.vue")
      .default
  }
};
</script>
