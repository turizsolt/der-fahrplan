import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Engine } from './structs/Engine';
import { PassengerGenerator } from './structs/PassengerGenerator';
import { Platform } from './structs/Platform';
import { Side } from './structs/Side';
import { Switch } from './structs/Switch';
import { Track } from './structs/Track';

window.addEventListener('DOMContentLoaded', () => {
  var canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  var renderEngine = new BABYLON.Engine(canvas, true);
  var createScene = function() {
    var scene = new BABYLON.Scene(renderEngine);
    scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

    var camera = new BABYLON.ArcRotateCamera(
      'Camera',
      1,
      0.8,
      300,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas as HTMLElement, true);

    var light = new BABYLON.DirectionalLight(
      'DirectionalLight',
      new BABYLON.Vector3(0, -1, 0),
      scene
    );
    light.intensity = 0.7;

    var pol = new BABYLON.PointLight('pl', BABYLON.Vector3.Zero(), scene);
    pol.diffuse = new BABYLON.Color3(1, 1, 1);
    pol.specular = new BABYLON.Color3(1, 1, 1);
    pol.intensity = 0.8;
    /*
                const trackCreatorList:TrackCreatorList = [

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

            {x: 0, z: 0},
            {x: 10, z: 0},
        ];
    */
    /*
        const ta = new Track(new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(30, 0, 0));
        // const ta = new Track(new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(20, 0, -10), new BABYLON.Vector3(20, 0 ,0));
        const tb = new Track(new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(20, 0, 10), new BABYLON.Vector3(20, 0 ,0));
        const sw = new Switch(ta, tb);
        sw.render(scene);
        */

    const trm4 = new Track({ x: -120, z: 110 }, { x: -90, z: 50 });
    const trm3 = new Track(
      { x: -90, z: 50 },
      { x: -80, z: 35 },
      { x: -85, z: 40 }
    );
    const trm2 = new Track({ x: -80, z: 35 }, { x: -50, z: 5 });
    const trm1 = new Track(
      { x: -50, z: 5 },
      { x: -40, z: 0 },
      { x: -45, z: 0 }
    );
    const tr0 = new Track({ x: -40, z: 0 }, { x: 10, z: 0 });

    const sw = new Switch(
      new BABYLON.Vector3(10, 0, 0),
      new BABYLON.Vector3(20, 0, 0),
      new BABYLON.Vector3(20, 0, 5),
      null,
      new BABYLON.Vector3(15, 0, 0)
    );

    const tr1 = new Track({ x: 20, z: 0 }, { x: 30, z: 0 });
    const tr2 = new Track({ x: 20, z: 5 }, { x: 30, z: 10 }, { x: 25, z: 10 });

    trm4.B.connect(trm3.A);
    trm3.B.connect(trm2.A);
    trm2.B.connect(trm1.A);
    trm1.B.connect(tr0.A);
    tr0.B.connect(sw.A);
    sw.E.connect(tr1.A);
    sw.F.connect(tr2.A);

    const pl1 = new Platform(
      'A1',
      tr0,
      0,
      24,
      10,
      Side.Left,
      new BABYLON.Color3(0, 1, 1)
    );
    pl1.render(scene);

    const pl2 = new Platform(
      'A2',
      tr0,
      26,
      50,
      10,
      Side.Right,
      new BABYLON.Color3(0, 0.6, 1)
    );
    pl2.render(scene);

    const pl3 = new Platform(
      'C',
      trm2,
      5,
      25,
      10,
      Side.Left,
      new BABYLON.Color3(0, 1, 0.6)
    );
    pl3.render(scene);
    const pl4 = new Platform(
      'D',
      trm4,
      35,
      65,
      10,
      Side.Right,
      new BABYLON.Color3(0, 0.6, 0.6)
    );
    pl4.render(scene);

    new PassengerGenerator([pl1, pl2, pl3, pl4], scene);

    // const trackList = new TrackList(trackCreatorList);
    // trackList.connect(trackList.list[0], tb);
    // trackList.connect(trackList.list[5], trackList.list[0]);
    // trackList.list[0].B.connect(sw.D);

    const engine = new Engine();
    // engine.putOnTrack(trackList.list[0]);

    // trackList.list.map(x => x.render(scene));
    engine.putOnTrack(tr0);
    trm4.render(scene);
    trm3.render(scene);
    trm2.render(scene);
    trm1.render(scene);
    tr0.render(scene);
    tr1.render(scene);
    tr2.render(scene);
    sw.render(scene);
    engine.render(scene);

    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 300, height: 300 },
      scene
    );
    ground.position.y = -1.5;

    /****************************Key Control Multiple Keys************************************************/

    var map = {}; //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        function(evt) {
          map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
        }
      )
    );

    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        function(evt) {
          map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
        }
      )
    );

    /****************************Move Sphere******************************************************/

    var enabledD = true;
    var enabled = true;
    scene.registerAfterRender(function() {
      if (map['w'] || map['W']) {
        engine.resume();
        engine.forward();
      }

      if (map['s'] || map['S']) {
        engine.resume();
        engine.backward();
      }

      if (map['d'] || map['D']) {
        if (enabledD) {
          engine.stop();
          enabledD = false;
          setTimeout(() => {
            enabledD = true;
          }, 500);
        }
      }

      if (map['1']) {
        if (enabled) {
          // console.log('1');
          sw.switch();
          enabled = false;
          setTimeout(() => {
            enabled = true;
          }, 500);
        }
      }
    });

    /****************************End************************************************/

    return scene;
  };
  var scene = createScene();
  renderEngine.runRenderLoop(function() {
    scene.render();
  });
  window.addEventListener('resize', function() {
    renderEngine.resize();
  });
  window.addEventListener('click', function() {
    // We try to pick an object
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    console.log(pickResult);
  });
});
