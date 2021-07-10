<template>
  <div>
    <div>PathBlock #{{ idt }}</div>
    <div v-for="(rule, index) in obj.queue.rules" :key="index">
      <div>
        {{obj.key[rule.from.joint+'-'+rule.from.end]}}
        =>
        <span v-for="(option, index) in rule.toOptions" :key="index">
          <span v-if="index !== 0">,</span> <span>{{obj.key[option.joint+'-'+option.end]}}</span>
        </span>
      </div>
    </div>
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
