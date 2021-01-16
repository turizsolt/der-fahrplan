<template>
  <div>
    <div>{{ idt }} Station</div>
    <trip-title
      :key="trip.id"
      v-for="trip in obj.schedule"
      :route="trip.route"
      :trip="trip"
      :station="obj"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VueIdStation extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
}
</script>

<style>
</style>
