<template>
    <div id="sg-container">
        <select v-model="selectedRouteId" @change="handleRouteChange">
            <option value="">Select a route</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">
                {{ route.name }}
                {{ route.detailedName }}
            </option>
        </select>
        <div id="sg-schedule-grid" :style="'grid-template-rows: repeat('+(rowCount)+', 10px);'">
            <div class="header0" style="grid-column: span 3; grid-row: span 6;">Header</div>
            <div class="header0 half" v-if="rowCount > 0"></div>
            <div class="header0 cell right time-cell" v-for="time in times">
                <div class="time">
                    {{time.extraTime}}
                </div>
                <div class="plus-minus">
                    <div @click="handleExtraTimePlus(time.stopId)">+</div>
                    <div @click="handleExtraTimeMinus(time.stopId)">-</div>
                </div>
            </div>
            <div class="header0 half" v-if="rowCount > 0"></div>
            <div class="header0" style="grid-column: span 3; grid-row: span 4;">Footer</div>

            <div class="header1 half" v-if="rowCount > 0"></div>
            <div class="header1 cell right time-cell" v-for="time in times">
                <div class="time">
                    {{time.time}}
                </div>
                <div class="plus-minus">
                    <div @click="handleTimePlus(time.stopId)">+</div>
                    <div @click="handleTimeMinus(time.stopId)">-</div>
                </div>
            </div>
            <div class="header1 half" v-if="rowCount > 0"></div>

            <div class="left header2" :class="stop.size === 2 ? 'cell-double' : 'cell'" v-for="stop in stops">{{stop.name}}</div>
            
            <template v-for="time in timetable">
                <div v-if="time.inter" class="column center">
                    Inter
                    <input
                        id="sg-adder"
                        style="width: 100%"
                        @keyup.stop="handleTime"
                        type="text"
                    />
                </div>
                <div v-else-if="time.sign" class="cell center" style="display: flex;">
                    <!--
                    ⤵ <input type="checkbox" /> ⓧ<br />
                    -->
                    <route-sign :name="time.sign.name" :color="time.sign.color" />
                </div>
                <div v-else-if="time.prev" class="cell-double center">
                    <template v-if="time.hasPrev">
                        <route-sign :name="time.prev.name" :color="time.prev.color" />
                        <div class="prev-time">{{time.prev.timeStr}}</div>
                        <div class="prev-arrow">▼</div>
                    </template>
                    <template v-else>
                        ?
                    </template>
                </div>
                <div v-else-if="time.next" class="cell-double center">
                    <template v-if="time.hasNext">
                        <div class="next-arrow">▼</div>
                        <div class="next-time">{{time.next.timeStr}}</div>
                        <route-sign :name="time.next.name" :color="time.next.color" />
                    </template>
                    <template v-else>
                        ?
                    </template>
                </div>
                <div v-else class="cell right">{{time.timeStr}}</div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";
import { Station } from "../../modules/Station/Station";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { TYPES } from "../../di/TYPES";
import { getAllOfStorable, getStorable, createStorable } from "../../structs/Actuals/Store/StoreForVue";
import { ScheduleGridComputer } from "./ScheduleGridComputer";
import { handleTimeText } from "./HandleTime";

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

    handleTime(event: any): void {
        const {time, timeStr} = handleTimeText(event);
        
        if(event.keyCode === 13) {
            const route = getStorable(this.selectedRouteId) as Route;
            const trip = createStorable<Trip>(TYPES.Trip).init(route, time);
            event.currentTarget.value = '';
            this.update();

            setTimeout(() => {
                const sg = document.getElementById('sg-schedule-grid');
                sg.scrollTo({ top: 0, left: sg.scrollWidth, behavior: "smooth" });
                const target = document.getElementById('sg-adder');
                target.focus();
            },0);
        } else {
            event.currentTarget.value = timeStr;
        }
    }

    handleTimeMinus(stopId:string): void {
        console.log('t-', stopId);
    }

    handleTimePlus(stopId:string): void {
        console.log('t+', stopId);
    }

    handleExtraTimeMinus(stopId:string): void {
        const stop = getStorable(stopId) as RouteStop;
        stop.setExtraTimeToStation(stop.getExtraTimeToStation()-30);
        this.update();
    }

    handleExtraTimePlus(stopId:string): void {
        const stop = getStorable(stopId) as RouteStop;
        stop.setExtraTimeToStation(stop.getExtraTimeToStation()+30);
        this.update();
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

#sg-schedule-grid > div {
    align-items: center;
    display: grid;
    height: 100%;
}

.time-cell {
    grid-template-columns: 30px 10px;
    grid-template-rows: 100%;
}

.time {
    width: 40px;
}

.plus-minus {
    position: relative;
    top: 0px;
    left: -30px;
    width: 40px;
    display: flex;
}

.plus-minus div {
    width: 20px;
    text-align: center;
    opacity: 0.3;
}

.plus-minus div:hover {
    background-color: #aca;
    opacity: 0.8;
    cursor: pointer;
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

.prev-time, .next-time {
    text-align: right;
}

.prev-arrow, .next-arrow {
    font-size: 8px;
    text-align: right;
    padding-right: 1.8em;
}

.prev-arrow {
    margin-top: -4px;
}

.next-arrow {
    margin-bottom: -4px;
}

</style>
