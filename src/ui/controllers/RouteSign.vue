<template>
  <div class="route-sign" :style="'background-color: #'+color+';'">
    {{name}}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class RouteTitle extends Vue {
  @Prop() name: string;
  @Prop() color: string;
}
</script>

<style scoped>
.route-sign {
    border-radius: 5px;
    border: 1px solid black;
    color: black;
    height: 15px;
    font-size: 12px;
    margin-left: auto;
    width: 28px;
}
</style>
