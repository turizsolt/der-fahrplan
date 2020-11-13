<template>
  <div class="stop">
    <div class="stop-circle" :style="{backgroundColor: stop.rgbColor}"></div>
    <div v-if="index !== route.stops.length-1" class="stop-after color"></div>
    <div v-if="index === route.stops.length-1" class="stop-after nocolor"></div>
    <div class="stop-name">{{stop.stationName}}</div>
    <div class="stop-button-holder" v-if="candelete || canmove">
      <div v-if="canmove" class="stop-button stop-move" @click.stop="$emit('move')">▲</div>
      <div v-if="candelete" class="stop-button stop-delete" @click.stop="$emit('delete')">x</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class RouteTitle extends Vue {
  @Prop() stop: any;
  @Prop() route: any;
  @Prop() index: number;
  @Prop() candelete?: boolean;
  @Prop() canmove?: boolean;
}
</script>

<style>
.stop:hover {
    background-color: #aaccaa;
}

.stop-button-holder {
    flex-grow: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
}

.stop-button {
    border-radius: 50%;
    background-color: #1a7829;
    color: #aaccaa;
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    margin: -1px 1px 1px 1px;
}

.stop-button:hover {
    border-radius: 50%;
    background-color: #aaccaa;
    color: #1a7829;
    cursor: pointer;
}
</style>
