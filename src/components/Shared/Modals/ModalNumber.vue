<template>
  <div class="q-mb-sm">
    <q-input
      :autofocus="autofocus"
      @input="$emit('update:number', $event)"
      outlined
      :value="number"
      :rules="[val => !!val || 'Field is required']"
      v-select-all
      clearable
      clear-icon="close"
      ref="number"
      :label="label"
      type="number"
      style="max-width: 200px"
    />
  </div>
</template>

<script>
import { selectAll } from "src/directives/directive-select-all.js";

export default {
  props: ["number", "label", "autofocus"],
  directives: {
    selectAll
  }
};
</script>
