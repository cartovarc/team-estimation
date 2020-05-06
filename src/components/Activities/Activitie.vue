<template>
  <q-item
    v-ripple
    v-touch-hold:1000.mouse="showEditActivitieModal"
    @click="
      updateActivity({
        id: activityId,
        updates: { completed: !activity.completed }
      })
    "
    :class="activity.completed ? 'bg-green-2' : 'bg-amber-2'"
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
          @click.stop="showEditActivitieModal"
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

    <q-dialog v-model="showEditActivitie">
      <edit-activity
        @close="showEditActivitie = false"
        :activity="activity"
        :activityId="activityId"
      />
    </q-dialog>
  </q-item>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { date } from "quasar";
const { formatDate } = date;

export default {
  props: ["activity", "activityId"],
  data() {
    return {
      showEditActivitie: false
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
    showEditActivitieModal() {
      this.showEditActivitie = true;
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, "ddd, D MMM YYYY");
    }
  },
  components: {
    "edit-activity": require("components/Activities/Modals/EditActivitie.vue")
      .default
  }
};
</script>
