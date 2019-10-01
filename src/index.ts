import 'babylonjs-loaders';
import * as BABYLON from 'babylonjs';
import {Engine} from "./structs/engine";
import {Switch} from "./structs/switch";
import {Track} from "./structs/track";
import {TrackCreatorList, TrackList} from "./structs/tracklist";

window.addEventListener('DOMContentLoaded', () => {
    var canvas:BABYLON.Nullable<HTMLCanvasElement> = document.getElementById("renderCanvas") as HTMLCanvasElement;
    var renderEngine = new BABYLON.Engine(canvas, true);
    var createScene  = function() {
        var scene = new BABYLON.Scene(renderEngine);
        scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

        var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 50, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas as HTMLElement, true);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
        light.intensity = 0.7;

        var pl = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), scene);
        pl.diffuse = new BABYLON.Color3(1, 1, 1);
        pl.specular = new BABYLON.Color3(1, 1, 1);
        pl.intensity = 0.8;

        const trackCreatorList:TrackCreatorList = [
            /*
            {x: 0, z: 0},
            {x: 10, z: 0},
            {x: 20, z: 0, im: true},
            {x: 20, z: 10},
            {x: 20, z: 20},
            {x: 20, z: 30, im: true},
            {x: 10, z: 30},
            {x: -10, z: 30, im: true},
            {x: -10, z: 10},
            {x: -10, z: 0, im: true},
            {x: 0, z: 0}
             */
            {x: 0, z: 0},
            {x: 10, z: 0},
        ];

        const ta = new Track(new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(30, 0, 0));
        // const ta = new Track(new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(20, 0, -10), new BABYLON.Vector3(20, 0 ,0));
        const tb = new Track(new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(20, 0, 10), new BABYLON.Vector3(20, 0 ,0));
        const sw = new Switch(ta, tb);
        sw.render(scene);

        const trackList = new TrackList(trackCreatorList);
        // trackList.connect(trackList.list[0], tb);
        // trackList.connect(trackList.list[5], trackList.list[0]);

        const engine = new Engine();
        engine.putOnTrack(trackList.list[0]);

        trackList.list.map(x => x.render(scene));
        engine.render(scene);


        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
        ground.position.y = -1.5;

        /****************************Key Control Multiple Keys************************************************/

        var map = {}; //object for multiple key presses
        scene.actionManager = new BABYLON.ActionManager(scene);

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

        }));

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));


        /****************************Move Sphere******************************************************/

        scene.registerAfterRender(function () {

            if ((map["w"] || map["W"])) {
                engine.forward();
            };

            if ((map["s"] || map["S"])) {
                engine.backward();
            };

            if ((map["1"])) {
                sw.switch();
            };
        });

        /****************************End************************************************/

        return scene;
    };
    var scene = createScene();
    renderEngine.runRenderLoop(function() {
        scene.render();
    });
});
