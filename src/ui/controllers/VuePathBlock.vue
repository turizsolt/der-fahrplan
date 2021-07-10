<template>
  <div class="main">
    <div>PathBlock #{{ idt }}</div>
    <table id="ruleTable">
      <tr v-for="(rule, index) in obj.queue.rules" :key="index">
        <td class="filter" @click="setFilterToRule(index)">{{rule.filter || "all"}}</td>
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
    <div>T: <input type="text" v-model="text" @keydown.stop="" @keyup.stop=""/></div>
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
  text: string = '';

  removeRule(index: number) {
      const pathBlock = getStorable(this.idt) as PathBlock;
      pathBlock.removeRule(index);
  }

  setFilterToRule(index: number) {
      const pathBlock = getStorable(this.idt) as PathBlock;
      pathBlock.setFilterToRule(index, this.text);
      this.text = '';
  }
}
</script>

<style>
#ruleTable {
    width: 100%;
}

.x:hover, .filter:hover {
    cursor: pointer;
    color: red;
}

.x {
    max-width: 2em;
    text-align: right;
}

.main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

</style>
