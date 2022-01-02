
import * as THREE from '../assets/three/build/three.module.js';

import { OrbitControls } from '../assets/three/examples/jsm/controls/OrbitControls.js';
import { ThreeMFLoader } from '../assets/three/examples/jsm/loaders/3MFLoader.js';
import Stats from '../assets/three/examples/jsm/libs/stats.module.js';
import { GUI } from '../assets/three/examples/jsm/libs/dat.gui.module.js';


let id, camera, scene, renderer, object, loader, controls, stats, gui, plane;
let arrow;
let nextTime = 0;
let nextStats = 0;
let planeTimer = 0;
let then = 0;
let DEG2RAD = Math.PI / 180;

// ============================== some default parameters ==============================
let calculatedPositions = [];
let radius = 0;
let currentEffect = 0;


// general parameters
let direction = 1;  // 1 => go towards max value; 0 => go towards lowest value
let helperSphereRadius = 1;
let spacing = 2;
let currentAngle = 0;

// Plane parameters
let minPlaneY = -10;
let maxPlaneY = 10;
let calculatedY = 0;

// Sphere parameters
let maxSphereSize = 25;






init();



function init() {
    let pixelRatio = window.devicePixelRatio >= 2 ? 1.6 : 1;
    let AA = pixelRatio >= 1 ? false : true;

    // ============================== Renderer ==============================
    renderer = new THREE.WebGLRenderer({ 
        //canvas, 
        alpha: true,
        antialias: pixelRatio,
        powerPreference: "high-performance",
        physicallyCorrectLights: true,
        outputEncoding: THREE.sRGBEncoding
        //sortObjects: false, // sort from least opaque object to most opaque object in the scene
    });
    // ignore this
    //renderer.setAnimationLoop();

    // Gamma correction
    //renderer.gammaFactor = 2.2;
    renderer.setPixelRatio( pixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    // ============================== GUI ==============================
    gui = new GUI( { width: 300 } );


    // ============================== Scene & Light ==============================
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );

    //scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );
    scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );
    const spotLight = new THREE.SpotLight( 0xdddddd, .45 );
    spotLight.position.set( 0, 100, 0 );
    scene.add( spotLight );

    // ============================== Camera ==============================
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 300 );
    camera.position.set( 0, 40, 50 );
    scene.add( camera );

    const pointLightCam = new THREE.PointLight( 0xffffff, 1 );
    //camera.add( pointLightCam );
   

    // ============================== Light setup ==============================
    makeHexagonalPrism( 8, 10, 0, 0 );
    //makeSquare( 8, 8, 8, 45 );


    if( currentEffect == 0 ) 
    {
        plane = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50 ), new THREE.MeshBasicMaterial( { 
                                                                                                color: 0x5555dd,
                                                                                                opacity: .5,
                                                                                                side: THREE.DoubleSide, 
                                                                                                depthWrite: false 
                                                                                            } ) );
        plane.quaternion.setFromEuler( new THREE.Euler( - Math.PI / 2, 0, 0 ) );
        scene.add(plane);
    }

    // ============================== HELPER ==============================
    /*const sphereSize = 10;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize, 0xffffff );
    scene.add( pointLightHelper );
    pointLightHelper.update();*/
    
    const grid = new THREE.GridHelper( 200, 50, 0x000000, 0x000000 );
    grid.position.y = -.1;
    grid.material.opacity = .2;
    grid.material.transparent = true;
    scene.add( grid );
    
    const axis = new THREE.AxesHelper( 50 );
    // axis.material.linewidth = 30; // https://threejs.org/docs/en/materials/LineBasicMaterial
    scene.add( axis );

    //scene.add( new THREE.CameraHelper( camera ) );

    /*
    scene.children.forEach(function (e) {
        console.log(e);
    });
    */
        
    stats = new Stats();
    document.body.appendChild( stats.dom );
    // ============================== HELPER END ==============================



    // ============================== Controls ==============================
    controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render );
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.4;
    controls.update();


    // ============================== Object ==============================
    /*
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

        console.log(object);
    
        scene.add( object );
        
        //const loadingScreen = document.getElementById( 'loading-screen' );
		//loadingScreen.classList.add( 'fade-out' );
		//remove loader from DOM via event listener
		//loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

        // liveview bar, little "easter egg"
        //document.getElementById("liveviewButton").addEventListener("click", toggleLiveview);


        console.log( 'Loading complete!');
        //isModelLoaded = true;
        animate();
    };

    loader = new ThreeMFLoader( manager );
    loader.load( '../assets/truck.3mf', //PaCaLa_hex_round_V1_web_v14 // truck
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
    */
}

function onTransitionEnd( event ) {
	event.target.remove();
}

/*
function guiMaterial( gui, material, geometry ) {

    const data = {
        color: material.color.getHex(),
    };

    const folder = gui.addFolder( 'Settings' );

    folder.add( material, 'transparent' );
    folder.add( material, 'opacity', 0, 1 ).step( 0.01 );
    folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
    folder.open()
}
*/


// TODO
/**
 * make a thingy
 * 
 * @param {Number} sizeX 
 * @param {Number} sizeY 
 * @param {Number} sizeZ 
 * @param {Number} rotation 
 */
function makeSquare( sizeX, sizeY, sizeZ, rotationY, rotationX ) 
{
    let index = 0;
    let position = null;

    // 
    for(let i=-sizeZ/2; i <= sizeZ/2; i++) 
    {
        for(let j=-sizeX/2; j <= sizeX/2; j++) 
        {
            for(let k=-sizeY/2; k <= sizeY/2; k++) 
            {
                let xPos = i * spacing;
                let yPos = k * spacing;
                let zPos = j * spacing;

                // calculate light positions
                if( rotationY === undefined && rotationX === undefined ) 
                {
                    position = new THREE.Vector3( xPos, yPos, zPos );

                } else 
                {    
                    position = rotatePointOnTwoXAndY( new THREE.Vector3( i, k, j ), rotationY, rotationX );
                }

                // add light to the scene
                // correct x, y, z coordinate
                scene.add( makeLight( index, new THREE.Vector3( (j+sizeX/2)*spacing, (k+sizeY/2)*spacing, (i+sizeZ/2)*spacing ) ) );

                // save the calculated positions
                calculatedPositions.push( [ index++, position ] );
            }
        }
    }
}


/**
 * make a thingy
 * 
 * @param {Number} radius 
 * @param {Number} sizeY 
 * @param {Number} rotation 
 */
function makeHexagonalPrism( radius, sizeY, rotationY, rotationX ) 
{
    let index = 0;
    let position = null;
    let sixtyDegrees = Math.PI / 3;

    // 
    for(let j=0; j <= 6; j++) 
    {
        for(let i=-sizeY/2; i <= sizeY/2; i++) 
        {
            let xPos = j >= 1 ? radius * Math.cos( sixtyDegrees * j ) : radius;
            let yPos = i * spacing;
            let zPos = j >= 1 ? radius * Math.sin( sixtyDegrees * j ) : 0;

            // calculate light positions
            if( rotationY === undefined && rotationX === undefined ) 
            {
                position = new THREE.Vector3( xPos, yPos, zPos );

            } else 
            {    
                position = rotatePointOnTwoXAndY( new THREE.Vector3( xPos, yPos, zPos ), rotationY, rotationX );
            }
        
            // add light to the scene
            // correct y position
            scene.add( makeLight( index, new THREE.Vector3( xPos, (i+(sizeY/2)+10)*spacing, zPos ) ) );

            // show calculated lights
            scene.add( makeLight( index, position, true ) );
            // save the calculated positions
            calculatedPositions.push( [ index++, position ] );
            
        }
    }
}

/**
 * Does some cool stuff
 * 
 * @param {Numer} radius 
 * @param {Numer} numYLights 
 * @param {Number} rotation 
 */
function calculateHexagonalPrismPoints( radius, sizeY, rotationY, rotationX ) 
{    
    let index = 0;
    let position = null;
    let sixtyDegrees = Math.PI / 3;

    // empty the whole array
    calculatedPositions = [];


    // 
    for(let j=0; j <= 6; j++) 
    {
        for(let i=-sizeY/2; i <= sizeY/2; i++) 
        {
            let xPos = j >= 1 ? radius * Math.cos( sixtyDegrees * j ) : radius;
            let yPos = i * spacing;
            let zPos = j >= 1 ? radius * Math.sin( sixtyDegrees * j ) : 0;

            // calculate light positions
            if( rotationY === undefined && rotationX === undefined )   
            {
                position = new THREE.Vector3( xPos, yPos, zPos );

            } else 
            {    
                position = rotatePointOnTwoXAndY( new THREE.Vector3( xPos, yPos, zPos ), rotationY, rotationX );
            }

            // save the calculated positions
            calculatedPositions.push( [ index++, position ] );
        }
    }
}



/**
 * makes a light at givin position
 * 
 * @param {THREE.Vector3} position 
 * @returns pointlight (+ helper) on givin position
 */
function makeLight( index, position, helper )
{
    if( helper === undefined ) helper = false;

    let pointLight = new THREE.PointLight( 0xffffff, 1, 7, 1.2 );
    let opacity = .9;

    pointLight.position.set( position.x, position.y, position.z );
    
    pointLight.name = "pl";
    pointLight.customID = index; 
    if( helper ) 
    { 
        pointLight.customHelperID = index;
        opacity = .3;
    }

    // create sphere on pointlights
    var geo = new THREE.SphereGeometry( helperSphereRadius, 16, 8 );
    var mat = new THREE.MeshBasicMaterial( { 
                                            color: 0xff3434, 
                                            transparent: true, 
                                            opacity 
                                            } );

    pointLight.add( new THREE.Mesh( geo, mat ) );

    return pointLight;
}



// TODO
/**
 * does cool things
 * 
 * @param {THREE.Vector3} currentPosition 
 * @param {Number} rotationY
 * @param {Number} rotationX
 * @returns rotated points
 */
function rotatePointOnTwoXAndY( currentPosition, rotationY, rotationX ) 
{
    if( rotationY === undefined ) rotationY = 0;
    if( rotationX === undefined ) rotationX = 0;

    let axisY = new THREE.Vector3( 0, 1, 0 );
    let axisX = new THREE.Vector3( 1, 0, 0 );
    
    let angleY = rotationY * DEG2RAD; // DEG TO RAD
    let angleX = rotationX * DEG2RAD; // DEG TO RAD

    currentPosition.applyAxisAngle( axisY, angleY );
    currentPosition.applyAxisAngle( axisX, angleX );

    return currentPosition;
}



// TODO
function isPointInSphere( position, radius ) {
    let distance = Math.sqrt( ( position.x**2 ) + ( position.y**2 ) + ( position.z**2 ));

    return distance <= radius;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}





// TODO write useful description
/**
 * 
 */
function toggleLiveview() 
{

    if( document.getElementById("liveview") ) 
    {
        // remove it completely from DOM for better performance
        document.getElementById("liveview").remove();
    } else 
    {
        // create a div with id "liveview" and append it to the header
        var divLiveview = document.createElement("div");
        divLiveview.setAttribute("id", "liveview");
        document.querySelector("header").appendChild( divLiveview );
    }
}



/**
 * 
 * @param {*} renderer 
 * @returns boolen wheter it needs to resize the canvas or not 
 */
function resizeRendererToDisplaySize( renderer ) 
{
    const width = window.innerWidth;
    const height = window.innerHeight;

    const needResize = window.innerWidth !== width || window.innerHeight !== height;
    if( needResize ) {
        /*
        if(window.innerWidth < 768) {
            camera.fov = 35;
        } else {
            camera.fov = 35;
        }
        console.log("camera FOV: "+ camera.fov);
        */

        renderer.setSize( width, height, false );
    }
    return needResize;
}


/*
 *      Main animation Loop
 *
 *  Distance is measured in meters (1 three.js unit = 1 meter).
 */
function animate( now ) 
{
    // Convert to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    let deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;



    if ( resizeRendererToDisplaySize( renderer ) ) 
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }



    

    /*
     *  Main Light changing function
     *
     */
    if( now >= nextTime ) 
    {

        let tolerance = .5;
        let minYPos = calculatedY - tolerance;
        let maxYPos = calculatedY + tolerance;


        scene.children.forEach( function( e )
        {
            if( e.name.includes("pl") ) 
            {
                let isPointActive = false;
                let virtualPosition = calculatedPositions[e.customID][1];

                
                if( e.customHelperID !== undefined )
                {
                    e.position.set( virtualPosition.x, virtualPosition.y, virtualPosition.z );

                }

                if( e.customID == 0 ) {
      
                }


                // run selected effect
                if( currentEffect == 0 )
                {
                    if( virtualPosition.y >= minYPos ) 
                    {
                        isPointActive = true; 
                    }

                // effect #1
                } else if( currentEffect == 1)
                {

                    if( isPointInSphere( virtualPosition, radius ) ) 
                    {
                        isPointActive = true;
                    }
                }
                

                let ent = e.children[0].material.color;



                if( isPointActive ) 
                {
                    ent.setHex( 0x94DE2C );
                    //e.children[0].visible = true;
                } else {
                    ent.setHex( e.customHelperID !== undefined ?  0xff0000 : 0x343434 );
                    //e.children[0].visible = false;
                }
            }
        });
        // liveview bar
        // its a bit laggy
        //handleLight.updateLiveview();

        nextTime = now + .01;
    }



    // moving plane along y axis
    if(now >= planeTimer) 
    {
        if( currentEffect == 0 )
        {
            //calculatedY = plane.position.y;
            //console.log("current plane Z: "+calculatedY);
            /*
            if( calculatedY <= minPlaneY ) 
            {
                direction = 1;
            }
            if( calculatedY >= maxPlaneY)
            {
                direction = -1;
            }

            plane.position.add( new THREE.Vector3( 0, .05*direction, 0 ) );
            */

            calculateHexagonalPrismPoints( 8, 10, 45, currentAngle % 360 );

            currentAngle += 2;

        } else if( currentEffect == 1 ) 
        {
            if( radius <= 1 ) 
            {
                direction = 1;
            }
            if( radius >= maxSphereSize)
            {
                direction = -1;
            }
    
            radius += .05*direction;
        }

        planeTimer = now + .01;
    }

    /*
     *  display low level stats in the console
     *  & display Debug console outputs
     */
    if(now >= nextStats) {
        var debugModel = true;

        console.log( scene );

        if(debugModel) 
        {
            
            console.log("Active Drawcalls:", renderer.info.render.calls);
            console.log("Scene polycount:", renderer.info.render.triangles);
            console.log("Current frame:", renderer.info.render.frame);
            console.log("Textures in Memory", renderer.info.memory.textures);
            console.log("Geometries (= objects) in Memory", renderer.info.memory.geometries);
            console.log("\n");
        }

        if(now > 5) {
            //calculateHexagonalPrismPoints( 8, 10, getRandomInt(0, 180), getRandomInt(0, 180) );
            //console.log( calculatedPositions );
        }
        nextStats = now + 10;
    }



    /*
     *  update methods that have to be called every frame
     *
     */

    // auto rotate camera
    // controls.update(); 
    // object.rotation.y = time*0.0005; // auto rotate object

    // update built-in THREE.js statistic graphs
    stats.update();
    

    id = requestAnimationFrame( animate );
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);