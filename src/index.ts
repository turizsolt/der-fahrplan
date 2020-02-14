import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Engine } from './structs/Engine/Engine';
import { Vector3 } from 'babylonjs';
import { TrackJoint } from './structs/TrackJoint/TrackJoint';
import { TrackSwitch } from './structs/TrackSwitch/TrackSwitch';
import { babylonContainer } from './structs/inversify.config';
import { Land } from './structs/Land/Land';
import { TYPES } from './structs/TYPES';

window.addEventListener('DOMContentLoaded', () => {
  var canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  var renderEngine = new BABYLON.Engine(canvas, true);

  let markers: TrackJoint[] = [];

  var createScene = function() {
    var scene = new BABYLON.Scene(renderEngine);
    scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

    var camera = new BABYLON.ArcRotateCamera(
      'Camera',
      1,
      0.8,
      180, // 300,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    // camera.attachControl(canvas as HTMLElement, true);

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

    /* level setup */

    (window as any).switches = [];

    const land = babylonContainer.get<Land>(TYPES.Land);
    const engine = land.init(markers);

    /* end of setup */

    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 300, height: 300 },
      scene
    );
    ground.position.y = -1.5;

    for (let i = -150; i <= 150; i += 10) {
      const gridVer = BABYLON.MeshBuilder.CreateLines(
        'gridVer',
        { points: [new Vector3(i, -1.49, -150), new Vector3(i, -1.49, 150)] },
        scene
      );
      gridVer.color = new BABYLON.Color3(0, 0, 0);

      const gridHor = BABYLON.MeshBuilder.CreateLines(
        'gridHor',
        { points: [new Vector3(-150, -1.49, i), new Vector3(150, -1.49, i)] },
        scene
      );
      gridHor.color = new BABYLON.Color3(0, 0, 0);
    }

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

  const arrowMaterial = new BABYLON.StandardMaterial('arrow', scene);
  arrowMaterial.diffuseTexture = new BABYLON.Texture('assets/arrow.png', scene);

  let mouseDownPoint = null;
  let mouseUpPoint = null;
  let mouseRotation = 0;
  let selected = null;
  let previousSelected = markers[1];
  markers[1].select();

  const mouseCone = BABYLON.MeshBuilder.CreateCylinder(
    'cone',
    {
      diameter: 5,
      tessellation: 24,
      height: 1,
      faceUV: [
        new BABYLON.Vector4(0, 0, 1, 1),
        new BABYLON.Vector4(1, 1, 1, 1)
      ],
      faceColors: [
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(0, 0, 0, 1),
        new BABYLON.Color4(1, 1, 0, 1)
      ],
      updatable: true
    },
    scene
  );
  mouseCone.material = arrowMaterial;

  const move = () => {
    // console.log('move');
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    const mouseMovePoint = pickResult.pickedPoint;

    if (mouseDownPoint || mouseMovePoint) {
      mouseCone.position = snapXZ(mouseDownPoint || mouseMovePoint);
      mouseCone.position.y = -0.6;
      mouseCone.rotation.y = mouseRotation;
      if (mouseDownPoint && mouseMovePoint) {
        var rotVector = new BABYLON.Vector3(
          mouseMovePoint.x - mouseDownPoint.x,
          0,
          mouseMovePoint.z - mouseDownPoint.z
        );
        let rot = Math.atan2(rotVector.x, rotVector.z);
        const fifteen = Math.PI / 12;
        rot = Math.round(rot / fifteen) * fifteen;
        if (rot !== mouseRotation) {
          // console.log((rot / Math.PI) * 180);
        }
        mouseRotation = rot;

        if (selected) {
          selected.rotate(rot);
        } else {
          mouseCone.rotation.y = rot;
        }
      }
    }
  };

  window.addEventListener('pointerdown', function(event) {
    // console.log('mousedown');
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    mouseDownPoint = pickResult.pickedPoint;

    console.log('picked', pickResult.pickedMesh.id);
    if (
      pickResult.pickedMesh &&
      pickResult.pickedMesh.id.startsWith('switchBox-')
    ) {
      const id = parseInt(pickResult.pickedMesh.id.substring(10), 10);
      console.log('swB', id);
      const sw: TrackSwitch = (window as any).switches.find(x => x.id === id);
      if (sw) {
        sw.switch();
      }
    } else if (
      pickResult.pickedMesh &&
      pickResult.pickedMesh.id.startsWith('m-')
    ) {
      const id = parseInt(pickResult.pickedMesh.id.substring(2), 10);
      const pos = markers.findIndex(x => x.getId() === id);
      if (pos === -1) return;

      selected = markers[pos];

      // console.log(event);
      if (event.ctrlKey) {
        // console.log('shift');
        //selected.setEnabled(false);
        markers[pos].remove();
        delete markers[pos];
      }
    } else {
      const position = snapXZ(mouseDownPoint);
      const joint = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
      joint.init(position.x, position.z, mouseRotation);
      markers.push(joint);

      selected = joint;
    }
    // console.log(markers.length);
  });

  window.addEventListener('pointerup', function() {
    // console.log('mouseup');
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    mouseUpPoint = pickResult.pickedPoint;

    // console.log(mouseDownPoint, mouseUpPoint);
    mouseDownPoint = null;
    mouseUpPoint = null;

    if (previousSelected && selected) {
      const w = selected.connect(previousSelected);

      //console.log(w);
    } else {
      //console.log('oups', previousSelected, selected);
    }

    previousSelected.deselect();
    previousSelected = selected;
    previousSelected.select();
    selected = null;
    move();
  });

  window.addEventListener('pointermove', function() {
    move();
  });
});

function snapXZ(p) {
  return new BABYLON.Vector3(snap(p.x), p.y, snap(p.z));
}

function snap(p) {
  const diff = p % 10;
  if (diff < 2.5 || diff > 7.5) return Math.round(p / 10) * 10;
  return p;
}
