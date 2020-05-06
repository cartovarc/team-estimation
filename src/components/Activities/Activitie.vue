<template>
  <q-item
    v-ripple
    v-touch-hold:1000.mouse="showEditActivitieModal"
    @click="
      updateActivitie({
        activitieId: activitieId,
        sprintId: sprintId,
        updates: { completed: !activitie.completed }
      })
    "
    :class="activitie.completed ? 'bg-green-2' : 'bg-amber-2'"
    clickable
  >
    <q-item-section side top>
      <q-checkbox :value="activitie.completed" class="no-pointer-events" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'text-strikethrough': activitie.completed }">
        {{ activitie.name }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="activitie.dueDate" side>
      <div class="row">
        <div class="colum">
          <q-item-label class="row justify-end" caption>
            {{ activitie.dueDate | niceDate }}
          </q-item-label>
          <q-item-label class="row justify-end" caption>
            <small>
              {{ activitieDueTime }}
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
      <edit-activitie
        @close="showEditActivitie = false"
        :activitie="activitie"
        :activitieId="activitieId"
        :sprintId="sprintId"
      />
    </q-dialog>
  </q-item>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { date } from "quasar";
const { formatDate } = date;

export default {
  props: ["activitie", "activitieId", "sprintId"],
  data() {
    return {
      showEditActivitie: false
    };
  },
  computed: {
    activitieDueTime() {
      if (this.settings.show12HourTimeFormat) {
        return date.formatDate(
          this.activitie.dueDate + " " + this.activitie.dueTime,
          "h:mmA"
        );
      }
      return this.activitie.dueTime;
    }
  },
  methods: {
    ...mapActions("sprints", ["updateActivitie", "deleteActivitie"]),
    promptToDelete() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteActivitie({
            sprintId: this.sprintId,
            activitieId: this.activitieId
          });
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
    "edit-activitie": require("components/Activities/Modals/EditActivitie.vue")
      .default
  }
};
</script>
