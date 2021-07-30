<template>
  <div>
    Map
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TYPES } from "../../di/TYPES";
import { Route } from "../../structs/Scheduling/Route";
import { Station } from "../../structs/Scheduling/Station";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";

@Component
export default class RailMapShower extends Vue {
  private map: RailMap;

  constructor() {
    super();
    
    setTimeout(() => {
      this.map = RailMapCreator.create(getStore());

      console.log(this.map.getEdges());
      console.log(this.map.getBounds());

      this.update();
    }, 0);
  }

  update() {

  }
}
</script>

<style scoped>

</style>
