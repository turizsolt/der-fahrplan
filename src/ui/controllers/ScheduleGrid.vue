<template>
    <div id="sg-container">
        <select v-model="selectedRouteId" @change="handleRouteChange">
            <option value="">Select a route</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">
                {{ route.name }}
                {{ route.detailedName }}
            </option>
        </select>
        <div id="sg-schedule-grid" :style="'grid-template-rows: repeat('+(2 * rowCount)+', 10px);'">
            <div class="header0 half" v-if="rowCount > 0"></div>
            <div class="header0 cell right" v-for="time in times">{{time.time}}</div>
            <div class="header0 half" v-if="rowCount > 0"></div>

            <div class="header1 half" v-if="rowCount > 0"></div>
            <div class="header1 cell right" v-for="time in times">{{time.time}}</div>
            <div class="header1 half" v-if="rowCount > 0"></div>

            <div class="left header2" :class="stop.size === 2 ? 'cell-double' : 'cell'" v-for="stop in stops">{{stop.name}}</div>
            
            <template v-for="time in timetable">
                <div v-if="time.inter" class="column center">Inter</div>
                <div v-else class="cell right">{{time.timeStr}}</div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Route } from "../../structs/Scheduling/Route";
import { Station } from "../../modules/Station/Station";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { TYPES } from "../../di/TYPES";
import { getAllOfStorable, getStorable, createStorable } from "../../structs/Actuals/Store/StoreForVue";
import { ScheduleGridComputer } from "./ScheduleGridComputer";

@Component
export default class ScheduleGrid extends Vue {
    routes: any[] = [];
    selectedRouteId:string = '';
    selectedRoute: any = null;

    stops:any[] = [];
    times:any[] = [];
    timetable:any[] = [];
    rowCount:number = 0;

    created() {
        this.load();
    }

    reset() {
        this.stops = [];
        this.times = [];
        this.timetable = [];
        this.rowCount = 0;
    }

    handleRouteChange(event:any):void {
        this.selectedRouteId = event.currentTarget.value;
        this.update();
    }

    load() {
        this.routes = getAllOfStorable<Route>(TYPES.Route)
            .map(x => x.persistDeep());
        this.update();
    };

    update() {
        if (this.selectedRouteId) {
            const route = (getStorable(
                this.selectedRouteId
            ) as Route);
            this.selectedRoute = route.persistDeep();

            if(route) {
                const {stops, times, rowCount, timetable} = ScheduleGridComputer.getByRoute(route);
                this.stops = stops;
                this.times = times;
                this.rowCount = rowCount;
                this.timetable = timetable;
            } else {
                this.reset();
            }
        } else {
            this.reset();
        }
    }
}
</script>

<style>
#sg-container {
    width: 100%;
}

#sg-schedule-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40px 40px 100px;
    grid-auto-columns: 60px;
    overflow: scroll hidden;
}

#sg-schedule-grid div {
    align-items: center;
    display: grid;
    height: 100%;
}

.left {
    text-align: left;
}

.right {
    text-align: right;
}

.center {
    text-align: center;
}

.cell {
    grid-row: span 2;
}

.cell-double {
    grid-row: span 4;
}

.column {
    grid-row: 1/-1;
}

.header0, .header1, .header2 {
    position: sticky;
    background-color: #cec;
}

.header0 {
    left: 0px;
}

.header1 {
    left: 40px;
}

.header2 {
    left: 80px;
}

</style>
