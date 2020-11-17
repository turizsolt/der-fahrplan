<template>
<div>
      <div class="item-type">🚂 Mozdony</div>
      <div class="item-id">{{idt}}</div>
      <div class="item-id">Speed: {{obj.speed ? obj.speed : '???'}}</div>

      <!-- train -->
      <div class="train">
          <div 
            @click="selectWagon(wagon.id)"
            v-for="wagon in obj.train.wagons"
            :key="wagon.id+(selectedWagons[wagon.id]?'-0':'-1')"
            :class="'wagon-box '+wagon.appearanceId"
            :title="(wagon.trip && wagon.trip.route) ? (wagon.trip.route.name+' '+wagon.trip.route.detailedName):'nope'"
          >
              <div :class="'wagon-inner '+wagon.appearanceId+' side-'+(wagon.side == 'A'?'a':'b')">
                  {{selectedWagons[wagon.id]?'*':''}}{{wagon.tripNo}}
              </div>
          </div> 
      </div>

      <div>Kiválasztott útirányok</div>
      <trip-title :key="trip.id" v-for="trip in obj.train.trips" :route="trip.route" :trip="trip" @click="assignTrip(trip.id)" />
      <div v-if="selectedCount > 0">
        <button @click="showTrips">Új hozzáadás</button>
        <button @click="clearTrip">Törlés</button>
      </div>
      
      <div>
        <div v-if="showTripList && opts && opts.length > 0">
          <div>Útirány kiválasztása...</div>
          <trip-title :key="trip.id" v-for="trip in opts" :route="trip.route" :trip="trip" @click="assignTrip(trip.id)" />
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
import { Wagon } from "../../structs/Interfaces/Wagon";
import { productionContainer } from "../../di/production.config";
import { Store } from "../../structs/Interfaces/Store";
import { TYPES } from "../../di/TYPES";
import { Train } from "../../structs/Scheduling/Train";
import { Trip } from "../../structs/Scheduling/Trip";

@Component
export default class VueWagon extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
  @Prop() opts: any[];

  selectedWagons: Record<string, boolean> = {};
  selectedCount: number = 0;
  showTripList: boolean = false;

  private store:Store;

  constructor() {
    super();
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
  }

  selectWagon(wagonId) {
      if(this.selectedWagons[wagonId]) {
          this.selectedCount--;
      } else {
          this.selectedCount++;
      }
      Vue.set(this.selectedWagons, wagonId, !this.selectedWagons[wagonId]);
  }

  assignTrip(vTripId) {
    if (!vTripId) return;
    
    const wagons:Wagon[] = [];
    for(let wagonId of Object.keys(this.selectedWagons)) {
      if(this.selectedWagons[wagonId]) {
        const wagon = this.store.get(wagonId) as Wagon;
        wagons.push(wagon);
        this.selectedWagons[wagonId] = false;
      }
    }
    this.selectedCount = 0;

    const train = this.store.get(this.obj.train.id) as Train;
    const trip = this.store.get(vTripId) as Trip;
    train.assignTrip(trip, wagons);

    this.showTripList = false;
  };

  clearTrip() {
    const wagons:Wagon[] = [];
    for(let wagonId of Object.keys(this.selectedWagons)) {
      if(this.selectedWagons[wagonId]) {
        const wagon = this.store.get(wagonId) as Wagon;
        wagons.push(wagon);
        this.selectedWagons[wagonId] = false;
      }
    }
    const train = this.store.get(this.obj.train.id) as Train;
    train.assignTrip(null, wagons);
    
    this.showTripList = false;
  }

  showTrips() {
    this.showTripList = true;
  }
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
