import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  10000
);
var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.1;
controls.maxDistance = 0.4;

var light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(500, 500, 500);
light1.castShadow = true;
scene.add(light1);

var light2 = new THREE.AmbientLight(0x333333, 5);
scene.add(light2);

var park;
var cars = [];
var loader = new GLTFLoader();

loader.load("./models/park/project.gltf", function (gltf) {
  park = gltf.scene;
  scene.add(park);
  park.position.set(0, 0, 0);

  var positions = [
    [-0.08, 0.005, -0.11],
    [-0.025, 0.005, -0.11],
    [0.026, 0.005, -0.11],
    [0.08, 0.005, -0.11],
  ];

  for (var i = 0; i < 4; i++) {
    loader.load("./models/car/scene.gltf", function (gltf) {
      var car = gltf.scene;
      scene.add(car);
      car.scale.set(0.03, 0.03, 0.03);
      car.position.set(
        positions[cars.length][0],
        positions[cars.length][1],
        positions[cars.length][2]
      );
      car.rotation.y = Math.PI;
      cars.push(car);
    });
  }
});

camera.position.set(0.2, 0.2, 0.2);

var port;
var reader;
var states = { 1: 0, 2: 0, 3: 0, 4: 0 };
var buffer = "";

async function connect() {
  try {
    port = await navigator.serial.requestPort({});
    await port.open({ baudRate: 9600 });
    btn.style.backgroundColor = "#00ff00";
    btn.textContent = "Connected";

    var decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    while (true) {
      var stuff = await reader.read();
      if (stuff.done) {
        reader.releaseLock();
        break;
      }
      if (stuff.value) {
        buffer = buffer + stuff.value;
        var lines = buffer.split("\n");
        buffer = lines.pop();

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line != "") {
            parse(line);
          }
        }
      }
    }
  } catch (error) {
    btn.textContent = "Disconnected";
    btn.style.backgroundColor = "#ff0000";
  }
}

function parse(data) {
  var pairs = data.split(" ");
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split(":");
    if (parts.length == 2) {
      var num = parseInt(parts[0]);
      var val = parseInt(parts[1]);
      if (num >= 1 && num <= 4 && val >= 0 && val <= 1) {
        states[num] = val;
      }
    }
  }
}

function update() {
  for (var i = 0; i < cars.length; i++) {
    if (cars[i]) {
      cars[i].visible = states[i + 1] == 1;
    }
  }

  var occupied = 0;
  for (var key in states) {
    occupied += states[key];
  }
  statsDiv.textContent = "Slots Available: " + (4 - occupied);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

var btn;
var statsDiv;
document.addEventListener("DOMContentLoaded", function () {
  btn = document.createElement("button");
  btn.textContent = "Connect to Arduino";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.padding = "10px 20px";
  btn.onclick = connect;
  document.body.appendChild(btn);

  statsDiv = document.createElement("div");
  statsDiv.style.position = "fixed";
  statsDiv.style.top = "10px";
  statsDiv.style.left = "10px";
  statsDiv.style.color = "white";
  statsDiv.style.background = "rgba(0,0,0,0.7)";
  statsDiv.style.padding = "10px";
  document.body.appendChild(statsDiv);
});

animate();
