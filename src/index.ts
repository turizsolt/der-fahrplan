import 'babylonjs-loaders';
import * as BABYLON from 'babylonjs';

window.addEventListener('DOMContentLoaded', () => {
    var canvas:BABYLON.Nullable<HTMLCanvasElement> = document.getElementById("renderCanvas") as HTMLCanvasElement;
    var engine = new BABYLON.Engine(canvas, true);
    var createScene  = function() {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

        var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 50, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas as HTMLElement, true);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
        light.intensity = 0.7;

        var pl = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), scene);
        pl.diffuse = new BABYLON.Color3(1, 1, 1);
        pl.specular = new BABYLON.Color3(1, 1, 1);
        pl.intensity = 0.8;

        var box = BABYLON.Mesh.CreateBox("box", 3, scene);
        box.position = new BABYLON.Vector3(0,1.5,0);
        var boxMaterial = new BABYLON.StandardMaterial("boxMat", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(1,0,0);
        box.material = boxMaterial;

        var boxp = BABYLON.Mesh.CreateBox("box", 0.5, scene);
        boxp.position = new BABYLON.Vector3(0,1.5,0);
        boxp.material = boxMaterial;

        var p0 = new BABYLON.Vector3(0, 0, 0);
        var p1 = new BABYLON.Vector3(0, 0, 10);
        var p2 = new BABYLON.Vector3(10, 0, 10);
        var points = [];
        points.push(new BABYLON.Vector3(0, 0, 0));
        points.push(new BABYLON.Vector3(0, 0, 10));
        var bezier = BABYLON.Curve3.CreateQuadraticBezier(
            p0,
            p1,
            p2,
            20);
        points = bezier.getPoints();
        var track = BABYLON.MeshBuilder.CreateLines(
            'track',
            // {points: points},
            {points: points},
            scene);
        console.log("by length", bezier.length());
        track.color = new BABYLON.Color3(0, 0, 0);

        var bezier2 = BABYLON.Curve3.CreateQuadraticBezier(
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 12),
            new BABYLON.Vector3(10, 0, 12),
            20);
        var track2 = BABYLON.MeshBuilder.CreateDashedLines(
            'track2',
            {points: bezier2.getPoints(), updatable: false, dashNb: 60, dashSize: 1, gapSize: 3},
            scene);
        track2.color = new BABYLON.Color3(0, 0, 0);

        var pos = 0;



        BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);

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
                pos += 0.1;
                if(pos > bezier.length()) pos = bezier.length();
            };

            if ((map["s"] || map["S"])) {
                pos -= 0.1;
                if(pos < 0) pos = 0;
            };

            var t = pos / bezier.length();
            var p = new BABYLON.Vector3(
                (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x,
                1.5,
                (1-t)*(1-t)*p0.z + 2*(1-t)*t*p1.z + t*t*p2.z,
            );
            var pd = new BABYLON.Vector3(
                2*(1-t)*(p1.x-p0.x) + 2*t*(p2.x-p1.x),
                0,
                2*(1-t)*(p1.z-p0.z) + 2*t*(p2.z-p1.z),
            );
            box.position = p;
            box.rotation.y = Math.atan2(pd.x, pd.z);

            boxp.position = p.add(pd.scale(0.4));
        });

        /****************************End************************************************/

        return scene;
    };
    var scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });
});
