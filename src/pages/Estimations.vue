<template>
  <div class="q-pa-md">
    <proyect-selector @projectChanged="selectFirstSprint" />

    <no-sprints v-if="showNoSprints" @showAddSprint="showAddSprint = true" />

    <q-table
      v-if="existsSprintInProject"
      title="Treats"
      :data="tableData"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top>
        <q-select
          ref="sprintSelector"
          outlined
          v-model="model"
          class="full-width q-mb-lg"
          :options="sprintsArray"
          label="Sprint"
        />

        <q-markup-table bordered class="full-width q-mb-lg">
          <tbody>
            <tr>
              <td class="text-left text-weight-medium">Total activities</td>
              <td class="text-right">
                <q-badge class="text-weight-bold" color="purple">
                  {{ totalActivities }}
                </q-badge>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-medium">
                Average sprint effort
              </td>
              <td class="text-right">
                <q-badge class="text-weight-bold" color="purple">
                  {{ summary.averageSprintEffort }}
                </q-badge>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-medium">
                Total estimated hours
              </td>
              <td class="text-right">
                <q-badge class="text-weight-bold" color="purple">
                  {{ summary.totalEstimatedHours }}
                </q-badge>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-medium">
                Total estimated hours (unforeseen)
              </td>
              <td class="text-right">
                <q-badge class="text-weight-bold" color="purple">
                  {{ summary.totalEstimatedHoursWithUnforeseen }}
                </q-badge>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              v-if="
                props.row.usersEstimations.length || props.row.userCompleted
              "
              size="sm"
              color="grey-7"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>

          <q-td :props="props"> </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name == 'name'" class="my-table-details">
              {{ props.row.name }}
            </div>
            <q-badge
              v-else
              class="text-weight-bold"
              :color="getBadgeColor(col.name)"
            >
              {{ props.row[col.name] }}
            </q-badge>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td
            v-if="props.row.usersEstimations.length || props.row.userCompleted"
            colspan="100%"
          >
            <q-banner
              v-if="props.row.completed"
              inline-actions
              class="text-white bg-green"
            >
              <span>
                User
              </span>

              <q-badge class="text-weight-bold  q-ml-xs" color="green-10">
                {{
                  profiles[props.row.userCompleted]
                    ? profiles[props.row.userCompleted].name
                    : "Anonymous"
                }}
              </q-badge>
              <q-space />
              completed the activity in
              <q-badge class="text-weight-bold" color="green-10">
                {{ props.row.realTime }} hours
              </q-badge>
            </q-banner>
            <q-item-label v-if="props.row.usersEstimations.length" header
              >User estimations</q-item-label
            >

            <q-list bordered class="rounded-borders">
              <q-item
                v-for="userEstimation in props.row.usersEstimations"
                v-bind:key="userEstimation.uid"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="userEstimation.imageURL" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{
                    userEstimation.name
                  }}</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-weight-bold">Effort: </span>
                    <q-badge class="text-weight-bold" color="blue">
                      {{ userEstimation.effort }}
                    </q-badge>
                  </q-item-label>

                  <q-item-label caption lines="2">
                    <span class="text-weight-bold">Estimated hours: </span>
                    <q-badge class="text-weight-bold" color="green">
                      {{ userEstimation.eh }}
                    </q-badge>
                  </q-item-label>

                  <q-item-label caption lines="2">
                    <span class="text-weight-bold"
                      >Estimated hours (Unforeseen):
                    </span>
                    <q-badge class="text-weight-bold" color="red">
                      {{ userEstimation.ehu }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState("sprints", ["sprints"]),
    ...mapState("projects", ["globalSelectedProject"]),
    ...mapState("activities", ["activities"]),
    ...mapState("auth", ["profiles"]),
    existsSprintInProject() {
      let thisAux = this;
      let exists = false;
      Object.keys(this.sprints).map(function(sprintId) {
        exists =
          exists ||
          thisAux.sprints[sprintId].project ==
            thisAux.globalSelectedProject.value;
      });
      return exists;
    },
    showNoSprints() {
      return !this.existsSprintInProject && this.globalSelectedProject.value;
    },
    sprintsArray() {
      let thisAux = this;
      return Object.keys(this.sprints)
        .map(function(sprintId) {
          return {
            label: thisAux.sprints[sprintId].name,
            value: sprintId,
            project: thisAux.sprints[sprintId].project
          };
        })
        .filter(function(element) {
          return element.project == thisAux.globalSelectedProject.value;
        });
    },
    sprintActivities() {
      try {
        let activities = Object.values(this.activities[this.model.value]);
        return activities;
      } catch (error) {
        // waiting to load data
        return [];
      }
    },
    totalActivities() {
      try {
        let res = Object.keys(this.activities[this.model.value]).length;
        return res;
      } catch (error) {
        // waiting to load data
        return 0;
      }
    },
    tableData() {
      let profiles = this.profiles;

      let reformedActivities = this.sprintActivities.map(function(activity) {
        let effort = 0;
        let eh = 0;
        let ehu = 0;
        let estimationsCounter = 0;
        let total = 0;
        let usersEstimations = [];
        if (activity.estimations) {
          Object.keys(activity.estimations)
            .map(function(uid) {
              return { estimation: activity.estimations[uid], uid: uid };
            })
            .forEach(function(payload) {
              let userEstimation = {
                name: profiles[payload.uid]
                  ? profiles[payload.uid].name
                  : "Anonymous",
                imageURL: profiles[payload.uid]
                  ? profiles[payload.uid].imageURL
                  : "https://static.thenounproject.com/png/574704-200.png",
                effort: payload.estimation["effort"],
                eh: payload.estimation["estimatedHours"],
                ehu: payload.estimation["estimatedHoursWithUnforeseen"]
              };

              usersEstimations.push(userEstimation);

              effort += parseInt(payload.estimation["effort"]);
              eh += parseInt(payload.estimation["estimatedHours"]);
              ehu += parseInt(
                payload.estimation["estimatedHoursWithUnforeseen"]
              );
              estimationsCounter += 1;
            });
          effort /= estimationsCounter;
          eh /= estimationsCounter;
          ehu /= estimationsCounter;
        } else {
          effort = "...";
          eh = "...";
          ehu = "...";
          total = 0;
        }
        let reformedActivity = {
          name: activity.name,
          completed: activity.completed,
          lastChanged: activity.lastChanged,
          userCompleted: activity.userCompleted,
          realTime: activity.realTime,
          total: estimationsCounter,
          usersEstimations: usersEstimations,
          effort: effort,
          eh: eh,
          ehu: ehu
        };
        return reformedActivity;
      });

      return reformedActivities;
    },
    summary() {
      let totalEstimatedHours = 0;
      let totalEstimatedHoursWithUnforeseen = 0;
      let averageSprintEffort = 0;
      let totalEfforts = 0;

      this.tableData.forEach(function(reformedActivity) {
        if (reformedActivity.eh != "...") {
          totalEstimatedHours += reformedActivity.eh;
        }
        if (reformedActivity.ehu != "...") {
          totalEstimatedHoursWithUnforeseen += reformedActivity.ehu;
        }

        if (reformedActivity.effort != "...") {
          averageSprintEffort += reformedActivity.effort;
          totalEfforts += 1;
        }
      });

      if (totalEfforts != 0) {
        averageSprintEffort /= totalEfforts;
      } else {
        averageSprintEffort = "...";
      }

      return {
        totalEstimatedHours: totalEstimatedHours,
        totalEstimatedHoursWithUnforeseen: totalEstimatedHoursWithUnforeseen,
        averageSprintEffort: averageSprintEffort
      };
    }
  },
  data() {
    return {
      model: null,
      columns: [
        {
          name: "name",
          label: "Acvitivy",
          align: "left"
        },
        { name: "total", label: "Total" },
        { name: "effort", label: "Effort" },
        { name: "eh", label: "EH" },
        { name: "ehu", label: "EH (U)" }
      ]
    };
  },
  methods: {
    ...mapGetters("sprints", ["firstSprint"]),
    getBadgeColor(colName) {
      if (colName == "total") {
        return "black";
      } else if (colName == "effort") {
        return "blue";
      } else if (colName == "eh") {
        return "green";
      } else if (colName == "ehu") {
        return "red";
      }
    },
    selectFirstSprint() {
      if (this.sprintsArray) {
        this.model = this.sprintsArray[0];
      }
    }
  },
  components: {
    "proyect-selector": require("components/Projects/ProjectSelector.vue")
      .default,
    "no-sprints": require("components/Sprints/NoSprints.vue").default
  },
  mounted() {
    this.selectFirstSprint();
  }
};
</script>
<style>
.my-table-details {
  font-size: 1em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
