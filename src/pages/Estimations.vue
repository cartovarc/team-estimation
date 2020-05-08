<template>
  <div class="q-pa-md">
    <q-table title="Treats" :data="tableData" :columns="columns" row-key="name">
      <template v-slot:top>
        <q-select
          ref="sprintSelector"
          outlined
          v-model="model"
          class="full-width q-mb-lg"
          :options="sprintsArray"
          label="Sprint"
          style="min-width: 200px"
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
              size="sm"
              color="accent"
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
          <q-td colspan="100%">
            <div class="text-left">
              This is expand slot for row above: {{ props.row.name }}.
            </div>
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
    ...mapState("activities", ["activities"]),

    sprintsArray() {
      let thisAux = this;
      return Object.keys(this.sprints).map(function(sprintId) {
        return { label: thisAux.sprints[sprintId].name, value: sprintId };
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
      let reformedActivities = this.sprintActivities.map(function(activity) {
        let effort = 0;
        let eh = 0;
        let ehu = 0;
        let estimationsCounter = 0;
        let total = 0;
        if (activity.estimations) {
          Object.keys(activity.estimations)
            .map(function(uid) {
              return activity.estimations[uid];
            })
            .forEach(function(estimation) {
              effort += parseInt(estimation["effort"]);
              eh += parseInt(estimation["estimatedHours"]);
              ehu += parseInt(estimation["estimatedHoursWithUnforeseen"]);
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
          lastChanged: activity.lastChanged,
          total: estimationsCounter,
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
    }
  },
  mounted() {
    this.model = this.firstSprint();
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