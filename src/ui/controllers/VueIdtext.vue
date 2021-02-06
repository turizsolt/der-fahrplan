<template>
  <div>{{idt}}</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VueIdtext extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
}
</script>

<style>
</style>
