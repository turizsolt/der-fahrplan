<template>
  <div>
    <div>Passenger #{{ idt }}</div>
    <hr />
    <div>HasPath: {{ obj.hasPath ? "true" : "false" }}</div>
    <hr />
    <div>Past: {{ obj.past }}</div>
    <div>From: {{ obj.fromName }}</div>
    <div>Via: {{ obj.via }}</div>
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
