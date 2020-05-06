<template>
  <div class="q-mb-sm">
    <q-input
      outlined
      :value="name"
      @input="$emit('update:name', $event)"
      :rules="[val => !!val || 'Field is required']"
      autofocus
      v-select-all
      clearable
      clear-icon="close"
      ref="modalName"
      :label="label"
    />
  </div>
</template>

<script>
import { selectAll } from "src/directives/directive-select-all.js";

export default {
  props: ["name", "label"],
  directives: {
    selectAll
  }
};
</script>
