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
                  0
                </q-badge>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-medium">
                Total estimated hours
              </td>
              <td class="text-right">
                <q-badge class="text-weight-bold" color="purple">
                  0
                </q-badge>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-medium">
                Total estimated hours (unforeseen)
              </td>
              <td class="text-right">
                <q-badge class="text-weight-bold" color="purple">
                  0
                </q-badge>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="my-table-details">
            {{ props.row.name }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-effort="props">
        <q-td :props="props">
          <q-badge class="text-weight-bold" color="blue">
            {{ props.row.effort }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-eh="props">
        <q-td :props="props">
          <q-badge class="text-weight-bold" color="green">
            {{ props.row.eh }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-ehu="props">
        <q-td :props="props">
          <q-badge class="text-weight-bold" color="red">
            {{ props.row.ehu }}
          </q-badge>
        </q-td>
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
      return this.sprintActivities.map(function(activity) {
        let effort = 0;
        let eh = 0;
        let ehu = 0;
        let estimationsCounter = 0;
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
        }
        let reformedActivity = {
          name: activity.name,
          effort: effort,
          eh: eh,
          ehu: ehu
        };
        return reformedActivity;
      });
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
        { name: "effort", label: "Effort" },
        { name: "eh", label: "EH" },
        { name: "ehu", label: "EH (U)" }
      ]
    };
  },
  methods: {
    ...mapGetters("sprints", ["firstSprint"])
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
