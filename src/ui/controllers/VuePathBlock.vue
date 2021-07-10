<template>
  <div>
    <div>PathBlock #{{ idt }}</div>
    <table id="ruleTable">
      <tr v-for="(rule, index) in obj.queue.rules" :key="index">
        <td>{{rule.filter}}</td>
        <td>
          {{obj.key[rule.from.joint+'-'+rule.from.end]}}
          =>
          <span v-for="(option, index2) in rule.toOptions" :key="index2">
            <span v-if="index2 !== 0">,</span> <span>{{obj.key[option.joint+'-'+option.end]}}</span>
          </span>
        </td>
        <td class="x" @click="removeRule(index)">X</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { getStorable } from "../../structs/Actuals/Store/StoreForVue";
import { PathBlock } from "../../modules/Signaling/PathBlock";

@Component
export default class VuePathBlock extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;

  removeRule(index: number) {
      const pathBlock = getStorable(this.idt) as PathBlock;
      pathBlock.removeRule(index);
  }
}
</script>

<style>
#ruleTable {
    width: 100%;
}

.x:hover {
    cursor: pointer;
    color: red;
}

.x {
    max-width: 2em;
    text-align: right;
}
</style>
