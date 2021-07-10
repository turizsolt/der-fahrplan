<template>
  <div>
    <div>{{ obj.name }} #{{ idt }}</div>
    Almafa PB
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VuePathBlock extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
}
</script>

<style>
</style>
