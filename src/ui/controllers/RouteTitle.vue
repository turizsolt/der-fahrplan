<template>
  <div
    :class="'route-line' + (selected ? ' route-line-selected' : '')"
    @click="$emit('click')"
  >
    <div class="route-sign">{{ route.name }}</div>
    <div
      class="route-circle route-circle-left"
      :style="{
        backgroundColor: route.stops[0] && route.stops[0].stationRgbColor,
      }"
    ></div>
    <div
      class="route-circle route-circle-right"
      :style="{
        backgroundColor:
          route.stops[0] && route.stops[route.stops.length - 1].stationRgbColor,
      }"
    ></div>
    <div class="route-name">
      {{ route.stops[0] ? route.stops[0].stationName : "Unknown" }}
      >
      {{
        route.stops[0]
          ? route.stops[route.stops.length - 1].stationName
          : "Unknown"
      }}
    </div>
    <div class="route-delete-holder" v-if="candelete">
      <div class="route-delete" @click.stop="$emit('delete')">x</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class RouteTitle extends Vue {
  @Prop() route: any;
  @Prop() selected?: boolean;
  @Prop() candelete?: boolean;
}
</script>

<style>
.route-circle {
  /* same as stop-circle */
  width: 10px;
  height: 10px;
  border: 2px solid #070;
  border-radius: 50%;
}

.route-line {
  display: flex;
  width: 100%;

  border: 1px solid #070;
  border-radius: 0.25em;
  background-color: #aca;

  margin-top: 5px;

  cursor: pointer;
}

.route-line:hover {
  background-color: #dfd;
}

.route-line.route-line-selected {
  background-color: rgb(44, 87, 44);
  color: #dfd;
}

.route-line.route-line-selected:hover {
  background-color: rgb(44, 87, 44);
  cursor: default;
}

.route-sign {
  width: 2em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 3px;
  padding-right: 3px;
}

.route-circle {
  margin-top: auto;
  margin-bottom: auto;
}

.route-circle-left {
  margin-left: 3px;
}

.route-circle-right {
  margin-right: 3px;
  margin-left: -5px;
}

.route-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-delete-holder {
  flex-grow: 1;
  text-align: right;
}

.route-delete {
  border-radius: 50%;
  background-color: #1a7829;
  color: #aaccaa;
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  margin: 1px 1px 1px auto;
}

.route-delete:hover {
  border-radius: 50%;
  background-color: #aaccaa;
  color: #1a7829;
  cursor: pointer;
}
</style>
