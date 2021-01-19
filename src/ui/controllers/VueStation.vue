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
      <div v-if="path.path.length > 1">
        <small
          ><i
            >(<span :key="elem.trip.id" v-for="elem in path.path"
              >{{ elem.trip.route.name }} - {{ elem.station.name }},</span
            >)</i
          ></small
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VueStation extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
}
</script>

<style>
</style>
