<template>
<div>
      <div class="item-type">🚂 Mozdony</div>
      <div class="item-id">{{idt}}</div>
      <div class="item-id">Speed: {{obj.speed ? obj.speed : '???'}}</div>

      <!-- train -->
      <div class="train">
          <div @click="selectWagon(wagon.id)" :key="wagon.id+selectedWagons[wagon.id]?'-0':'-1'" v-for="wagon in obj.train.wagons" :class="'wagon-box '+wagon.appearanceId">
              <div :class="'wagon-inner '+wagon.appearanceId+' side-'+(wagon.side == 'A'?'a':'b')">
                  {{selectedWagons[wagon.id]?'*':''}}
              </div>
          </div> 
      </div>

      <!-- trips -->
      <div v-if="obj.trip">
        <div class="trip">
          <div class="trip-name">{{obj.trip.name}}</div>
          <div class="trip-destination">▶ {{obj.trip.destination}}</div>
        </div>
        <div :key="stop.id" v-for="(stop, index) in obj.trip.stops">
          <route-stop :route="obj.trip" :stop="stop" :index="index">
          </route-stop>
        </div>
        <div class="trip-buttons">
          <div class="trip-buttons-inner">
            <div class="xbutton trip-cancel" @click="removeRoute(obj)">❌ Útirány törlése</div>
          </div>
        </div>
      </div>

      <!-- no trips -->
      <div v-else>
        <div v-if="opts && opts.length > 0">
          <div>Útirány kiválasztása...</div>
          <trip-title :key="trip.id" v-for="trip in opts" :route="trip.route" :trip="trip" @click="assignTrip(obj, trip.id)" />
        </div>
        <div v-if="!opts || opts.length === 0">
        <select class="route-select" size="1" disabled>
            <option>Nincs kiválsztható útirány</option>
          </select>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VueWagon extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
  @Prop() opts: any[];

  selectedWagons: Record<string, boolean> = {};

  selectWagon(wagonId) {
      Vue.set(this.selectedWagons, wagonId, !this.selectedWagons[wagonId]);
  }

  assignTrip(vWagon, vTripId) {
    if (!vTripId) return;
    console.log('assignTrip', vTripId);
  };
}
</script>

<style>
.train {
    display: flex;
    margin-bottom: 20px;
}

.wagon-box{
    width: 28px;
    height: 10px;
    border-radius: 2px;
    margin-right: 1px;
    user-select: none;
}

.wagon-inner {
    height: 10px;
    user-select: none;
    font-size: 20px;
    font-weight: bold;
    line-height: 16px;
    text-align: center;
}

.wagon-inner.wagon{
    border: 1px solid darkred;
    background-color: lightsalmon;
    width: 26px;
    border-radius: 2px;
}

.wagon-box.mot{
    border: 1px solid darkred;
    background-color: lightsalmon;
}

.wagon-inner.mot{
    border-top: 1px solid darkblue;
    border-bottom: 1px solid darkblue;
    background-color: lightblue;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: -1px;
    border-radius: 0px;
}

.wagon-inner.utas{
    border: 1px solid darkblue;
    background-color: lightblue;
    width: 26px;
    border-radius: 2px;
}

.wagon-box.vez{
    border: 1px solid darkred;
    background-color: lightsalmon;
}

.wagon-inner.vez{
    border-top: 1px solid darkblue;
    border-bottom: 1px solid darkblue;
    background-color: lightblue;
    margin-top: -1px;
    border-radius: 0px;
}

.wagon-inner.vez.side-b{
    border-left: 1px solid darkblue;
    margin-left: -1px;
    margin-right: 5px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.wagon-inner.vez.side-a{
    border-right: 1px solid darkblue;
    margin-left: 5px;
    margin-right: -1px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
}
</style>