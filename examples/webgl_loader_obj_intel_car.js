// Copyright 2023 Cris Bai
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

let camera, scene, renderer;

init();
animate();


function init() {
  camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 20);
  camera.position.z = 0;
  camera.position.x = 4;
  camera.position.y = 2;
  camera.lookAt(-1.0, 0, 0);

  // scene

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 15);
  camera.add(pointLight);
  scene.add(camera);

  // model

  const onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  new MTLLoader()
      .setMaterialOptions({
        side: THREE.FrontSide,
        wrap: THREE.ClampToEdgeWrapping,
        normalizeRGB: false,
        ignoreZeroRGBs: false,
        invertTrProperty: false
      })
      .setPath('models/obj/intelcar/')
      .load('intelcar.mtl', function(materials) {
        materials.preload();

        new OBJLoader()
            .setMaterials(materials)
            .setPath('models/obj/intelcar/')
            .load('intelcar.obj', function(object) {
              object.position.y = 0;
              object.scale.setScalar(0.8);
              scene.add(object);
            }, onProgress);
      });


  new MTLLoader()
      .setPath('models/obj/intelcar/')
      .load('bowl_with_texture.mtl', function(materials) {
        materials.preload();

        new OBJLoader()
            .setMaterials(materials)
            .setPath('models/obj/intelcar/')
            .load('bowl_with_texture.obj', function(object) {
              object.position.y = 0;
              object.scale.set(3, 6, 3);
              scene.add(object);
            }, onProgress);
      });

  //

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.useLegacyLights = false;
  document.body.appendChild(renderer.domElement);

  //

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2;
  controls.maxDistance = 5;

  //

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
