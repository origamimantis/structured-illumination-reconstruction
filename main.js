'use strict';
import * as THREE from "three"
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


function loadmanny()
{
  setMesh("manny", 30)
}
function loadcroc()
{
  setMesh("croc", 45)
}
function loadcouple()
{
  setMesh("couple", 40)
}
function loadteapot()
{
  setMesh("teapot", 20)
}
document.getElementById("loadmanny").onclick = loadmanny
document.getElementById("loadcroc").onclick = loadcroc
document.getElementById("loadcouple").onclick = loadcouple
document.getElementById("loadteapot").onclick = loadteapot


let scene = new THREE.Scene()

let light = new THREE.AmbientLight( 0xeeeeee );

let camera = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
)

let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor( 0x414243, 1 );
function setRenderSize()
{
  let dim = Math.max(window.innerWidth, window.innerHeight)/3
  let cap = Math.min(window.innerWidth, window.innerHeight, dim) - 20
  renderer.setSize(cap, cap);
  document.getElementById("threedom").style.width = cap.toString() + "px";
  document.getElementById("threedom").style.height = cap.toString() + "px";

  document.getElementById("baseimg").style.width = cap.toString() + "px";
  document.getElementById("baseimg").style.height = cap.toString() + "px";
  document.getElementById("theimg").style.width = cap.toString() + "px";

  document.getElementById("giffer").style.width = cap.toString() + "px";
  document.getElementById("giffer").style.height = cap.toString() + "px";
  document.getElementById("thegif").style.width = cap.toString() + "px";
}
setRenderSize();

document.getElementById("threedom").appendChild(renderer.domElement)

let controls = new TrackballControls(camera, renderer.domElement)
let loader = new GLTFLoader()
let canchange = true;

function setMesh(filename, cameradist=25)
{
  // "mutex"
  if (canchange == false)
    return;
  canchange = false;

  document.getElementById("loadmanny").disabled = true;
  document.getElementById("loadcroc").disabled = true;
  document.getElementById("loadcouple").disabled = true;
  document.getElementById("loadteapot").disabled = true;

  // clear scene. Since we are only drawing one mesh,
  //   remaking the scene is sufficient.
  scene = new THREE.Scene();
  scene.add(light);
  renderer.setClearColor( 0x808080, 1 );
  document.getElementById("theimg").src = ""
  document.getElementById("thegif").src = ""
  document.getElementById("threehint").innerHTML = "Loading model for " + filename + "...";
  document.getElementById("theimg").src = "assets/"+filename+".png"
  document.getElementById("thegif").src = "assets/"+filename+".gif"

  loader.load(
      "models/"+filename+".gltf",
      (gltf) => {

	// set metalness to zero. This seems to be a common problem with gltf files.
	// But I still choose to use this format because it includes texture data.
	gltf.scene.traverse( (child) => {
	  if ( child.material )
	    child.material.metalness = 0;
	});

	// apply rotations to make everything right-side-up, facing correct angle
	gltf.scene.rotation.z = - Math.PI / 2;
	gltf.scene.rotation.y = Math.PI;

	scene.add(gltf.scene);
	renderer.setClearColor( 0x414243, 1 );

	controls.reset();
	camera.position.z = cameradist;
	document.getElementById("threehint").innerHTML = "Drag to look around:";

	document.getElementById("loadmanny").disabled = false;
	document.getElementById("loadcroc").disabled = false;
	document.getElementById("loadcouple").disabled = false;
	document.getElementById("loadteapot").disabled = false;
	canchange = true;
      },
      (xhr) => {
	  if (xhr.loaded == xhr.total)
	    console.log("loaded " + filename)
      },
      (error) => {
	  console.log(error)
      }
  )
}
// "dev mode"
console.big = (s) => {setMesh(s)}

window.addEventListener('resize', () =>
  {
    camera.updateProjectionMatrix()
    setRenderSize();
  },
  false);


function mainloop()
{
    requestAnimationFrame(mainloop)

    controls.update()
    renderer.render(scene, camera)
}


window.onload = () =>
{
  loadcouple();
  mainloop();
}
