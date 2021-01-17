<template>
  <div>
    <div>{{ obj.name }} #{{ idt }}</div>
    <trip-title
      :key="trip.id"
      v-for="trip in obj.schedule"
      :route="trip.route"
      :trip="trip"
      :station="obj"
    />
    <hr />
    <div>Next startings</div>
    <div :key="path.stationId" v-for="path in obj.shortestPathes">
      {{ path.departureTimeString }} - {{ path.firstTripName }} -
      {{ path.stationName }}
    </div>
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
