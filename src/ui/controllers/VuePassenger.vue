<template>
  <div>
    <div>Passenger #{{ idt }}</div>
    <hr />
    <div>HasPath: {{ obj.hasPath ? "true" : "false" }}</div>
    <hr />
    <div>From: {{ obj.fromName }}</div>
    <div>To: {{ obj.toName }}</div>
    <hr />
    <div>NextChange: {{ obj.nextName }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VuePassenger extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
}
</script>

<style>
</style>
