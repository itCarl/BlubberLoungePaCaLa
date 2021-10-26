import * as THREE from '../three/build/three.module.js';

import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from '../three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeMFLoader } from '../three/examples/jsm/loaders/3MFLoader.js';
import Stats from '../three/examples/jsm/libs/stats.module.js';
import { color, GUI } from '../three/examples/jsm/libs/dat.gui.module.js';
import { strFromU8 } from '../three/examples/jsm/libs/fflate.module.js';
import { pacalaLight } from '../js/pacalaLight.js';

let camera, scene, renderer, object, loader, controls, stats;
let handleLight;
var id = null;
var nextTime = 0;
var nextStats = 0;
var then = 0;


let party = [
    new THREE.Color(0x5500AB), new THREE.Color(0x84007C), new THREE.Color(0xB5004B), new THREE.Color(0xE5001B),
    new THREE.Color(0xE81700), new THREE.Color(0xB84700), new THREE.Color(0xAB7700), new THREE.Color(0xABAB00),
    new THREE.Color(0xAB5500), new THREE.Color(0xDD2200), new THREE.Color(0xF2000E), new THREE.Color(0xC2003E),
    new THREE.Color(0x8F0071), new THREE.Color(0x5F00A1), new THREE.Color(0x2F00D0), new THREE.Color(0x0007F9)
];


const container = document.getElementById( 'model-container' );
const canvas = document.getElementById( 'model' );

//
init();

function init() {
    let pixelRatio = window.devicePixelRatio >= 2 ? 1.6 : 1; // window.devicePixelRatio
    let AA = pixelRatio >= 1 ? false : true;

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: pixelRatio,
        powerPreference: "high-performance",
        physicallyCorrectLights: true,
        //sortObjects: false, // sort from least opaque object to most opaque object in the scene
    });
    //renderer.setAnimationLoop();
    //renderer.physicallyCorrectLights = true;
    // Gamma correction
    // renderer.gammaFactor = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio( pixelRatio );
    //renderer.setPixelRatio( window.devicePixelRatio ); // default = 2, better performance on mobile = 1, 2.625 on Samsung Galaxy S10
    /*renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.clientWidth, container.clientHeight );
    container.appendChild( renderer.domElement );*/

    // Scene & Light
    scene = new THREE.Scene();
    scene.background = null; //new THREE.Color( 0x343434 );

    //scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );
    scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );
    const spotLight = new THREE.SpotLight( 0xdddddd, .45 );
    spotLight.position.set( 0, 100, 0 );
    scene.add( spotLight );

    // Camera
    camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 100 );
    camera.position.set( - 30, 40, 30 );
    scene.add( camera );

    const pointLightCam = new THREE.PointLight( 0xffffff, 1 );
    //camera.add( pointLightCam );
   
    // led strip 'pixel' setup 
    const sphere = new THREE.SphereGeometry( 1, 16, 8 );
    const pixel = 6;
    const faces = 5;
    //numPixels = (faces+1) * (pixel+1);

    for(let j=0; j <= faces; j++) {
        for(let i=0; i <= pixel; i++) {
            let yPos_start = -7;
            let yPos_end = 9;
            let radius = 8;

            // calculate light positions
            let xPos = j>=1?radius*Math.cos((Math.PI/3)*j):radius;
            let yPos = (j%2!==0?yPos_start + ((Math.abs(yPos_end)+Math.abs(yPos_start))/pixel)*i:yPos_end - ((Math.abs(yPos_end)+Math.abs(yPos_start))/pixel)*i) ;
            let zPos = j>=1?radius*Math.sin((Math.PI/3)*j):0;

            //var color = "0x" + Math.floor(Math.random()*16777215).toString(16);

            var pointLight = new THREE.PointLight( 0xff0000, 1, 7, 1.2 );
            pointLight.position.set(xPos, yPos, zPos);
            var clr=i==0?0xff0000:i==pixel?0x00ff00:0xffffff;
            pointLight.name = "pl"+i+"-"+j;
            // DEBUG create sphere on pointlights
            //pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: clr } ) ) );
            scene.add( pointLight );
        }
    }

    handleLight = new pacalaLight( scene );

    // ===== HELPER =====
    /*const sphereSize = 10;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize, 0xffffff );
    scene.add( pointLightHelper );
    pointLightHelper.update();*/
    
    /*
    const grid = new THREE.GridHelper( 500, 100, 0x000000, 0x000000 );
    grid.position.y = - 5;
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    */

    //scene.add( new THREE.AxesHelper(400) );
    //scene.add( new THREE.CameraHelper( camera ) );

    /*scene.children.forEach(function (e) {
        console.log(e);
    });*/
        
    stats = new Stats();
    document.body.appendChild( stats.dom );
    // ===== HELPER END =====


    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render );
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    //controls.autoRotateSpeed = 1.4;
    controls.update();

    // Object
    const manager = new THREE.LoadingManager();
    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

        console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    
    };
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

        console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    
    };
    manager.onError = function ( url ) {

        console.log( 'There was an error loading ' + url );
    
    };
    manager.onLoad = function () {

        const aabb = new THREE.Box3().setFromObject( object );
        const center = aabb.getCenter( new THREE.Vector3() );

        // dead center the object
        object.position.x += ( object.position.x - center.x );
        object.position.y += ( object.position.y - center.y );
        object.position.z += ( object.position.z - center.z );
        
        //object.quaternion.setFromEuler( new THREE.Euler( - Math.PI / 2, 0, 0 ) ); 
        
        controls.reset();

        object.name = "willich";
        //object.children[17].visible = false;

        /*for(var i=0; i<object.children.length; i++) {
            object.children[i].visible = false;
        }*/

        /*
        for(var i=0; i<object.children.length-1; i++) 
        {
            object.children[i].children[0].material =  new THREE.MeshBasicMaterial({ color : 0xff0000 });
        }
        */
        
        //object.children[object.children.length-1].children[0].material =  new THREE.MeshPhongMaterial({ color : 0xffffff });
        object.children[object.children.length-1].children[0].material.shininess = 5;

        console.log(object);
    
        scene.add( object );

        /*const material = new THREE.MeshPhysicalMaterial( {
            color: params.color,
            metalness: params.metalness,
            roughness: params.roughness,
            ior: params.ior,
            envMapIntensity: params.envMapIntensity,
            transmission: params.transmission, // use material.transmission for glass materials
            specularIntensity: params.specularIntensity,
            specularTint: params.specularTint,
            opacity: params.opacity,
            side: THREE.DoubleSide,
            transparent: true
        } );

        // 10 in v77
        //  3 in v85_web
        let diffusor = scene.getObjectByName("willich").children[10].children[0]; //scene.getObjectByProperty('uuid', 'B70738D4-BAEC-4B61-99AF-30596F2A520F');
        

        diffusor.material = material;
        console.log(diffusor);*/
        
        const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		//remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

        // liveview bar, little "easter egg"
        document.getElementById("liveviewButton").addEventListener("click", toggleLiveview);


        console.log( 'Loading complete!');
        isModelLoaded = true;
        animate();
    };

    loader = new ThreeMFLoader( manager );
    loader.load( 'assets/PaCaLa_hex_round_V1_web_v14.3mf', //PaCaLa_hex_round_V1_web_v14 // truck
    // called when the resource is loaded
    function ( group ) {
        if ( object ) {
            object.traverse( function ( child ) {
                //if ( child.material ) child.material.dispose();
                //if ( child.material && child.material.map ) child.material.map.dispose();
                //if ( child.geometry ) child.geometry.dispose();
            } );
            scene.remove( object );
        }
        object = group;
    });
    
    // GUI
    //const gui = new GUI( { width: 500 } );

}

function onTransitionEnd( event ) {
	event.target.remove();
}


// TODO write useful description
/**
 * 
 */
function toggleLiveview() {

    if(document.getElementById("liveview")) {
        // remove it completely from DOM for better performance
        document.getElementById("liveview").remove();
    } else {
        // create a div with id "liveview" and append it to the header
        var divLiveview = document.createElement("div");
        divLiveview.setAttribute("id", "liveview");
        document.querySelector("header").appendChild( divLiveview );
    }
}



/**
 * 
 * @param {*} renderer 
 * @returns boolen wheter it neds to rezie the canvas or not 
 */
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        /*
        if(window.innerWidth < 768) {
            camera.fov = 35;
        } else {
            camera.fov = 35;
        }
        console.log("camera FOV: "+ camera.fov);
        */

        renderer.setSize(width, height, false);
    }
    return needResize;
}


/*
 *      Main animation Loop
 *
 *  Distance is measured in meters (1 three.js unit = 1 meter).
 */
function animate(now) {
    // Convert to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;



    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }



    

    /*
    *  Main Light changing function
    *
    */
    if(now >= nextTime) {

        // update lights aka "LEDs"
        handleLight.update( now, party );
        
        // liveview bar
        // its a bit laggy
        handleLight.updateLiveview();

        nextTime = now + .01;
    }

    /*
     *  display low level stats in the console
     *  & display Debug console outputs
     */
    if(now >= nextStats) {
        var debugModel = true;

        if(debugModel) 
        {
            
            console.log("Active Drawcalls:", renderer.info.render.calls);
            console.log("Scene polycount:", renderer.info.render.triangles);
            console.log("Current frame:", renderer.info.render.frame);
            console.log("Textures in Memory", renderer.info.memory.textures);
            console.log("Geometries (= objects) in Memory", renderer.info.memory.geometries);
            console.log("\n");
        }

        nextStats = now + 10;
    }



    /*
     *  update methods that have to be called every frame
     *
     */

    // auto rotate camera
    controls.update(); 
    //object.rotation.y = time*0.0005; // auto rotate object

    // update built-in THREE.js statistic graphs
    stats.update();
    

    id = requestAnimationFrame( animate );
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);