<template>
  <q-page padding>
    <div class="q-gutter-md">
      <q-item-label header>Organizations</q-item-label>

      <q-list bordered padding class="rounded-borders">
        <q-item>
          <q-item-section>
            <q-input
              disable
              v-model="organizationName"
              label="New organization name"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn style="min-width: 80px" disable color="green" label="New" />
          </q-item-section>
        </q-item>

        <q-item>
          <span class="text-red"
            >Upgrade to create your own organizations
          </span>
        </q-item>

        <q-item>
          <q-item-section>
            <q-select
              v-model="model"
              :options="options"
              label="Working organization"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn
              style="min-width: 80px"
              :disable="model == null"
              color="primary"
              label="Invite"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-card>
        <q-tabs
          v-model="tab"
          class="q-ma-md"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="received" label="Received" />
          <q-tab name="sent" label="Sent" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="received">
            <q-item-label caption lines="1"
              >Organizations invitations</q-item-label
            >

            <q-item>
              <q-item-section avatar>
                <q-avatar icon="home_work" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">DANALYTICS</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  dense
                  class="q-mb-xs"
                  color="green"
                  icon="check_circle"
                />
                <q-btn dense color="red" icon="cancel" />
              </q-item-section>

              <q-item-section side> </q-item-section>
            </q-item>
          </q-tab-panel>

          <q-tab-panel name="sent">
            <q-item-label caption lines="1">Sent invitations</q-item-label>
            <q-item>
              <q-item-section avatar>
                <q-avatar icon="person" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">cartovarc@gmail.com</q-item-label>
                <q-item-label caption>
                  <q-badge color="black" label="DAnalytics" />
                  <q-badge class="q-ml-xs" label="Pending" />
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn dense icon="cancel" color="red" />
              </q-item-section>

              <q-item-section side> </q-item-section>
            </q-item>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      organizationName: "",
      model: null,
      options: ["DAnalytics"],
      tab: "received"
    };
  }
};
</script>

<style></style>
