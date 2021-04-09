<template>
  <div>
    <div class="item-type">🚂 Mozdony</div>
    <div class="item-id">{{ idt }}</div>
    <div class="item-id">
      Speed: {{ obj.speed ? Math.round(obj.speed * 40) : "???" }}<br />
      NE: {{ Math.round(obj.nearestEnd * 10) }}<br />
      NT: {{ Math.round(obj.nearestTrain * 10) }}
    </div>

    <!-- train -->
    <div class="train">
      <div
        @click="selectWagon(wagon.id)"
        v-for="wagon in obj.train.wagons"
        :key="wagon.id + (selectedWagons[wagon.id] ? '-0' : '-1')"
        :class="'wagon-box ' + wagon.appearanceId + ' pattern-' + wagon.tripNo"
        :title="
          wagon.trip && wagon.trip.route
            ? wagon.trip.route.name + ' ' + wagon.trip.route.detailedName
            : 'nope'
        "
      >
        <div
          :class="
            'wagon-inner ' +
            wagon.appearanceId +
            ' side-' +
            (wagon.side == 'A' ? 'a' : 'b') +
            ' pattern-' +
            wagon.tripNo
          "
        >
          {{ selectedWagons[wagon.id] ? "*" : "" }}
        </div>
      </div>
    </div>

    <div>
      <button @click="showTrips">Új</button>
      <button @click="clearTrip">Töröl</button>
    </div>

    <div>
      <div v-if="showTripList && opts && opts.length > 0">
        <div>Útirány kiválasztása...</div>
        <trip-title
          :key="trip.id"
          v-for="trip in opts"
          :route="trip.route"
          :trip="trip"
          @click="assignTrip(trip.id)"
        />
      </div>
      <div v-if="!opts || opts.length === 0">
        <select class="route-select" size="1" disabled>
          <option>Nincs kiválsztható útirány</option>
        </select>
      </div>
    </div>

    <!-- trips -->
    <div>Kiválasztott útirányok</div>
    <div :key="trip.id" v-for="(trip, index) in obj.train.trips">
      <div class="trip" @click="assignTrip(trip.id, true)">
        <div
          :style="'background-color: ' + trip.route.color + ';'"
          :class="'trip-name pattern-' + (index + 1)"
        >
          {{ trip.route.name }}
        </div>
        <div class="trip-destination">▶ {{ trip.route.destination }}</div>
      </div>

      <route-stop
        v-for="(stop, index) in trip.stops"
        :key="stop.id"
        :route="trip.route"
        :stop="stop"
        :index="index"
        isTrip
      >
      </route-stop>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Wagon } from "../../structs/Interfaces/Wagon";
import { getStorable } from "../../structs/Actuals/Store/StoreForVue";
import { Train } from "../../modules/Train/Train";
import { Trip } from "../../structs/Scheduling/Trip";

@Component
export default class VueWagon extends Vue {
  @Prop() idt: string;
  @Prop() obj: any;
  @Prop() opts: any[];

  selectedWagons: Record<string, boolean> = {};
  selectedCount: number = 0;
  showTripList: boolean = false;

  selectWagon(wagonId) {
    if (this.selectedWagons[wagonId]) {
      this.selectedCount--;
    } else {
      this.selectedCount++;
    }
    Vue.set(this.selectedWagons, wagonId, !this.selectedWagons[wagonId]);
  }

  update() {
    const wagon = getStorable(this.obj.id) as Wagon;
    wagon.update();
  }

  assignTrip(vTripId, isPreDefinedTrip) {
    if (!vTripId) return;

    if (this.selectedCount === 0 && !isPreDefinedTrip) {
      const train = getStorable(this.obj.train.id) as Train;
      const trip = getStorable(vTripId) as Trip;
      // todo train.assignTrip(null);
      // todo train.assignTrip(trip);

      this.showTripList = false;
    } else {
      const wagons: Wagon[] = [];
      for (let wagonId of Object.keys(this.selectedWagons)) {
        if (this.selectedWagons[wagonId]) {
          const wagon = getStorable(wagonId) as Wagon;
          wagons.push(wagon);
          this.selectedWagons[wagonId] = false;
        }
      }
      this.selectedCount = 0;

      const train = getStorable(this.obj.train.id) as Train;
      const trip = getStorable(vTripId) as Trip;
      // todo train.assignTrip(trip, wagons);

      this.showTripList = false;
    }
    this.update();
  }

  clearTrip() {
    if (this.selectedCount === 0) {
      const train = getStorable(this.obj.train.id) as Train;
      // todo train.assignTrip(null);

      this.showTripList = false;
    } else {
      const wagons: Wagon[] = [];
      for (let wagonId of Object.keys(this.selectedWagons)) {
        if (this.selectedWagons[wagonId]) {
          const wagon = getStorable(wagonId) as Wagon;
          wagons.push(wagon);
          this.selectedWagons[wagonId] = false;
        }
      }
      const train = getStorable(this.obj.train.id) as Train;
      // todo train.assignTrip(null, wagons);

      this.showTripList = false;
    }
    this.update();
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

.wagon-box {
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

.wagon-inner.wagon {
  border: 1px solid darkred;
  background-color: lightsalmon;
  width: 26px;
  border-radius: 2px;
}

.wagon-box.mot {
  border: 1px solid darkred;
  background-color: lightsalmon;
}

.wagon-inner.mot {
  border-top: 1px solid darkblue;
  border-bottom: 1px solid darkblue;
  background-color: lightblue;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: -1px;
  border-radius: 0px;
}

.wagon-inner.utas {
  border: 1px solid darkblue;
  background-color: lightblue;
  width: 26px;
  border-radius: 2px;
}

.wagon-box.vez {
  border: 1px solid darkred;
  background-color: lightsalmon;
}

.wagon-inner.vez {
  border-top: 1px solid darkblue;
  border-bottom: 1px solid darkblue;
  background-color: lightblue;
  margin-top: -1px;
  border-radius: 0px;
}

.wagon-inner.vez.side-b {
  border-left: 1px solid darkblue;
  margin-left: -1px;
  margin-right: 5px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.wagon-inner.vez.side-a {
  border-right: 1px solid darkblue;
  margin-left: 5px;
  margin-right: -1px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.pattern-1 {
  --stripe: rgba(255, 255, 255, 0.5);
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    var(--stripe) 5px,
    var(--stripe) 10px
  );
}

.pattern-2 {
  --bg: rgba(255, 255, 255, 0.5);

  background: linear-gradient(135deg, var(--bg) 25%, transparent 25%) -5px 0,
    linear-gradient(225deg, var(--bg) 25%, transparent 25%) -5px 0,
    linear-gradient(315deg, var(--bg) 25%, transparent 25%),
    linear-gradient(45deg, var(--bg) 25%, transparent 25%);
  background-size: 10px 10px;
}

.pattern-3 {
  --stripe: rgba(255, 255, 255, 0.5);
  background-image: radial-gradient(var(--stripe) 20%, transparent 20%),
    radial-gradient(var(--stripe) 20%, transparent 20%);
  background-position: 15px 15px, 5px 15px;
  background-size: 20px 20px;
}

.trip-name.pattern-3 {
  background-position: 15px 15px, 5px 5px;
}

.pattern-4 {
  --stripe: rgba(255, 255, 255, 0.5);
  background-image: linear-gradient(45deg, var(--stripe) 25%, transparent 25%),
    linear-gradient(-45deg, var(--stripe) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--stripe) 75%),
    linear-gradient(-45deg, transparent 75%, var(--stripe) 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}
</style>
