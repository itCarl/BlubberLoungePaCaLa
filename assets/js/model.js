import * as THREE from '../three/build/three.module.js';

import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from '../three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeMFLoader } from '../three/examples/jsm/loaders/3MFLoader.js';
import Stats from '../three/examples/jsm/libs/stats.module.js';
import { color, GUI } from '../three/examples/jsm/libs/dat.gui.module.js';
import { strFromU8 } from '../three/examples/jsm/libs/fflate.module.js';

let camera, scene, renderer, object, loader, controls, stats;
var id = null;
var nextTime = 0;
var nextTime1 = 0;
var nextStats = 0;
var numPixels = 0
var currentLed = 0
var currentColor = 0;
var hue = 0;
var hue1 = 0;
var then = 0;
var next = 0;

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

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    //renderer.physicallyCorrectLights = true;
    // Gamma correction
    // renderer.gammaFactor = 2.2;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    //renderer.setPixelRatio( .1 ); // default = 2, better performance on mobile = 1
    /*renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.clientWidth, container.clientHeight );
    container.appendChild( renderer.domElement );*/

    // Scene & Light
    scene = new THREE.Scene();
    scene.background = null; //new THREE.Color( 0x343434 );
    scene.add( new THREE.AmbientLight( 0xffffff, 0.4 ) );
    const spotLight = new THREE.SpotLight( 0xffffff, 0.8 );
    spotLight.position.set( 100, 1000, 100 );
    scene.add( spotLight );

    // Camera
    camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 1000 );
    camera.position.y = 300;
    camera.position.z = 500;
    scene.add( camera );

    const pointLightCam = new THREE.PointLight( 0xffffff, 0.1 );
    camera.add( pointLightCam );
   
    // led strip 'pixel' setup 
    const sphere = new THREE.SphereGeometry( 5, 16, 8 );
    const pixel = 6;
    const faces = 5;
    numPixels = (faces+1) * (pixel+1);

    for(let j=0; j <= faces; j++) {
        for(let i=0; i <= pixel; i++) {
            let yPos_start = -60;
            let yPos_end = 90;
            let radius = 40*2;

            // calculate light positions
            let xPos = j>=1?radius*Math.cos((Math.PI/3)*j):radius;
            let yPos = (j%2!==0?yPos_start + ((Math.abs(yPos_end)+Math.abs(yPos_start))/pixel)*i:yPos_end - ((Math.abs(yPos_end)+Math.abs(yPos_start))/pixel)*i) ;
            let zPos = j>=1?radius*Math.sin((Math.PI/3)*j):0;

            //var color = "0x" + Math.floor(Math.random()*16777215).toString(16);

            var pointLight = new THREE.PointLight( 0xff0000, .5, 100, 1.3 );
            pointLight.position.set(xPos, yPos, zPos);
            var clr=i==0?0xff0000:i==pixel?0x00ff00:0xffffff;
            pointLight.name = "pl"+i+"-"+j;
            // DEBUG create sphere on pointlights
            //pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: clr } ) ) );
            scene.add( pointLight );
        }
    }


    // ===== HELPER =====
    /*const sphereSize = 10;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize, 0xffffff );
    scene.add( pointLightHelper );
    pointLightHelper.update();*/

    //scene.add(new THREE.AxesHelper(500));

    /*scene.children.forEach(function (e) {
        console.log(e);
    });*/
        
    stats = new Stats();
    document.body.appendChild( stats.dom );
    // ===== HELPER END =====


    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render );
    controls.minDistance = 500;
    controls.maxDistance = 1000;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    //controls.update();

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

        object.position.x += ( object.position.x - center.x );
        object.position.y += ( object.position.y - center.y );
        object.position.z += ( object.position.z - center.z );

        controls.reset();

        object.name = "willich";
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
        //document.getElementById("liveviewButton").addEventListener("click", toggleLiveview);


        console.log( 'Loading complete!');
        isModelLoaded = true;
        animate();
    };

    loader = new ThreeMFLoader( manager );
    loader.load( 'assets/PaCaLa_hex_round_V1_web_v6.3mf', 
    // called when the resource is loaded
    function ( group ) {
        if ( object ) {
            object.traverse( function ( child ) {
                if ( child.material ) child.material.dispose();
                if ( child.material && child.material.map ) child.material.map.dispose();
                if ( child.geometry ) child.geometry.dispose();
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





















/***************************************************************************
 *
 *      ported fastLed colorutil methods (this section will be moved to a different file later)
 *      // http://fastled.io/docs/3.1/colorutils_8h_source.html
 * 
 ***************************************************************************/

/*  THREE.Color has already util functions built-in
/**
 * 
 * @param {number} r - number between 0 ... 255 or 0 ... 1
 * @param {number} g - number between 0 ... 255 or 0 ... 1
 * @param {number} b - number between 0 ... 255 or 0 ... 1 
 * @returns hex value
 *//*
function rgb_to_hex(r, g, b) {
    // a try to figure out if rgb colors 
    // are in 0 ... 1 or 0 ... 255 format
    if( r <= 1  && g <= 1 && b <= 1 ) 
    {
        r *= 255;
        g *= 255;
        b *= 255;
    }

    return (r << 16) | (g << 8) | b ;
} */

function goThroughPalette(index, t, calculatedColor, pal) 
{
    const f = Math.floor(pal.length / pal.length);
    const i1 = Math.floor((t / f) % pal.length); //Math.floor((index * 255 / numPixels) % pal.length);
    let i2 = i1 + 1;

    // check boundaries
    if (i2 === pal.length) i2 = 0;
  
    var color1 = new THREE.Color(pal[i1]);
    var color2 = new THREE.Color(pal[i2]);
    const a = (t / f) % pal.length % 1;
  
    calculatedColor.copy(color1);
    calculatedColor.lerp(color2, a);
    return calculatedColor.getHex();
}

// https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}


/**
 * 
 * 
 * @param {Array}   currentPalette  - 16 entry [index, r, g, b] color palette 
 * @param {number}  colorIndex      - number between 0 ... 255, modulo allows for wrap arround, example: 275 => colorIndex 20
 * @param {boolean} currentBlending - wheter or not to linear blend the colors
 * @returns 
 */
function ColorFromPalette(currentPalette, colorIndex, currentBlending) {
    colorIndex = mod(colorIndex, 256);
    var paletteIndex = mod(colorIndex >> 4, 16); // get a number between 0 and 15
    var colorIndexLow4 = colorIndex & 0x0F;

//    console.log(paletteIndex+ " bs shit " +currentPalette[paletteIndex]);

    var color = currentPalette[paletteIndex]; 

    var r = color.r;
    var g = color.g;
    var b = color.b;

    // if blending is enabled return a color that is blend 
    // with the next color in the palette
    if( currentBlending ) {
        if( paletteIndex >= 15 ) {
            paletteIndex = 0;
        } else {
            paletteIndex++;
        }

        color = currentPalette[paletteIndex]; 
        
        const f2 = colorIndexLow4 << 4;
        const f1 = 256 - f2 +2;
       
        /* dis calculations is shit on some palettes somehow
           probably some floating errors
        var red2 = color.r;
        r        = r * (f1 / 256);
        red2     = red2 * (f2 / 256);
        r       += red2;

        var green2 = color.g;
        g          = g * (f1 / 256);
        green2     = green2 * (f2 / 256);
        g         += green2;

        var blue2 = color.b;
        b         = b * (f1 / 256);
        blue2     = blue2 * (f2 / 256);
        b        += blue2;
        */

        /*
        dis is good stuff
        works way better then the shit above
        lerp( color, alpha ) 
        {
            this.r += ( color.r - this.r ) * alpha;
            this.g += ( color.g - this.g ) * alpha;
            this.b += ( color.b - this.b ) * alpha;
            return this;
        }
        */
       
       var temp = new THREE.Color(r, g, b);
       return temp.lerp(color, f2/256);
       
    }

    return new THREE.Color(r, g, b);

}



/**
 *  get a range of colors with a smooth RGB gradient
 *  between two specified RGB colors.
 *  Unlike HSV, there is no 'color wheel' in RGB space,
 *  and therefore there's only one 'direction' for the
 *  gradient to go, and no 'direction code' is needed.
 * 
 * @param {number} startpos   - start 'led' position
 * @param {Array}  startcolor - color to start transitioning from, can be an [r,g,b] Array or hex value
 * @param {number} endpos     - end 'led' position
 * @param {Array}  endcolor   - color to transition to, can be an [r,g,b] Array or hex value
 * @returns array of rgb colors in a gradient
 */
function get_gradient_RGB(startpos, startcolor, endpos, endcolor )
{
    var leds = [];

    // passed colors have to be an [r, g, b] array or a hex value
    startcolor = {
        r: Array.isArray(startcolor)? startcolor[1] : startcolor >> 16 & 0xFF,
        g: Array.isArray(startcolor)? startcolor[2] : startcolor >>  8 & 0xFF,
        b: Array.isArray(startcolor)? startcolor[3] : startcolor       & 0xFF,
    };    
    
    endcolor = {
        r: Array.isArray(endcolor)? endcolor[1] : endcolor >> 16 & 0xFF,
        g: Array.isArray(endcolor)? endcolor[2] : endcolor >>  8 & 0xFF,
        b: Array.isArray(endcolor)? endcolor[3] : endcolor       & 0xFF,
    };  

    // if the points are in the wrong order, straighten them
    if( endpos < startpos ) {
        var t = endpos;
        var tc = endcolor;
        endcolor = startcolor;
        endpos = startpos;
        startpos = t;
        startcolor = tc;
    }

    var rdistance87;
    var gdistance87;
    var bdistance87;

    rdistance87 = (endcolor.r - startcolor.r) << 7;
    gdistance87 = (endcolor.g - startcolor.g) << 7;
    bdistance87 = (endcolor.b - startcolor.b) << 7;

    var pixeldistance = endpos - startpos;
    var divisor = pixeldistance ? pixeldistance : 1;    // division by 0 protection

    var rdelta87 = rdistance87 / divisor;
    var gdelta87 = gdistance87 / divisor;
    var bdelta87 = bdistance87 / divisor;

    rdelta87 *= 2;
    gdelta87 *= 2;
    bdelta87 *= 2;

    var r88 = startcolor.r << 8;
    var g88 = startcolor.g << 8;
    var b88 = startcolor.b << 8;

    for( var i = startpos; i <= endpos; ++i) {
        leds.push ( [
                    r88 >> 8, 
                    g88 >> 8, 
                    b88 >> 8
                  ] );
        r88 += rdelta87;
        g88 += gdelta87;
        b88 += bdelta87;
    }

    return leds;
}


// TODO write useful description
/**
 * This function does some cool stuff... will explain later 
 * 
 * @param {*} gpal 
 * @returns 
 */
function loadDynamicGradientPalette( gpal )
{
    var colors = [];

    var i = 0;
    var u = gpal[0];

    var count = gpal.length;
    var lastSlotUsed = -1;

    var rgbstart = [ gpal[i][0], gpal[i][1], gpal[i][2], gpal[i][3] ];

    var indexstart = 0;
    var istart8 = 0;
    var iend8 = 0;
    while( indexstart < 255) {
        ++i;
        u = gpal[i];
        var indexend  = u[0];
        var rgbend = [ gpal[i][0], gpal[i][1], gpal[i][2], gpal[i][3] ];
        istart8 = indexstart / 16;
        iend8   = indexend   / 16;
        if( count < 16) 
        {
            if( (istart8 <= lastSlotUsed) && (lastSlotUsed < 15)) 
            {
                istart8 = lastSlotUsed + 1;
                if( iend8 < istart8) 
                {
                    iend8 = istart8;
                }
            }
            lastSlotUsed = iend8;
        }
     
        get_gradient_RGB( istart8, rgbstart, iend8, rgbend).forEach((e) => {
            colors.push(new THREE.Color( (e[0] << 16) | (e[1] << 8) | e[2]) );
        });        

        indexstart = indexend;
        rgbstart = rgbend;
    }
    return colors;
}
/***************************************************************************
 *
 *      END ported fastLed colorutil methods (this section will be moved to a different file later)
 *      // http://fastled.io/docs/3.1/colorutils_8h_source.html
 * 
 ***************************************************************************/















// TODO write usefull description
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
        if(window.innerWidth < 768) {
            camera.fov = 40;
        } else {
            camera.fov = 35;
        }
        console.log("camera FOV: "+ camera.fov);

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



    var counter = (now * ((255 >> 3) +1)) & 0xFFFF;

    /*
    *  Main Light changing function
    *
    */
    if(now >= nextTime) {

        var n = [];

        scene.children.forEach(function (e) {
            if (e.name.includes("pl")) {
                currentLed = currentLed >= numPixels-1 ? 0 : currentLed+1;
                currentColor = currentColor >= party.length-1 ? next=0 : Math.floor((next + currentLed)%(party.length-1));
                var cc = null;

                var mode = 3;
                var palette = examplePalette;
                
                if(mode == 1) 
                {
                    hue = hue1 + (currentLed * 8);
                    cc = new THREE.Color( "hsl("+ hue  +", 100%, 50%)" );
                } else if(mode == 2) {
                    cc = new THREE.Color( goThroughPalette(currentLed, next, e.color, party) );
                } else if(mode == 3) {
                    cc = new THREE.Color( ColorFromPalette(party, (currentLed * 255 / (numPixels/2)) - counter, true) );
                } else if(mode == 4) {
                    cc = new THREE.Color( 
                                    ColorFromPalette(
                                        loadDynamicGradientPalette( palette ), 
                                        ( currentLed * 255 / (numPixels/2) ) - counter, 
                                        true
                                    ) 
                                );
                }
                

                if(e.name.includes("pl0-0")) {
                    //console.log(ColorFromPalette2(party, next, false));
                    //console.log(cc.getHex());
                }

                n.push(cc.getHex());
                e.color.setHex( Math.abs(cc.getHex()) );
                //e.children[0].material.color.setHex( Math.abs(cc.getHex()) );
            }
        });
         

        // liveview bar
        // its a bit laggy
        /*if(document.getElementById( "liveview" ))
        {
            let e="linear-gradient(90deg,";
            for(var i = 0; i < n.length; i++ ) {
                var r = (n[i] >> 16) & 255;
                var g = (n[i] >>  8) & 255;
                var b =  n[i]        & 255;
                e += " rgb("+ r +","+ g +","+ b +")";
                e += n.length-1 == i ? "" : ",";
            };
            e += ")";
            document.getElementById( "liveview" ).style.background=e;
        }*/


        nextTime = now + .01;
    }


    /*
     *  some timers for effects
     *
     */
    if(now >= nextTime1) {        
        hue1 += .1;
        next += .01;
        nextTime1 = now + .01;
        
    }



    /*
     *  display low level stats in the console
     *  & display Debug console outputs
     */
    if(now >= nextStats) {
        var debugModel = false;

        if(debugModel) 
        {
            console.log("Scene polycount:", renderer.info.render.triangles)
            console.log("Active Drawcalls:", renderer.info.render.calls)
            console.log("Textures in Memory", renderer.info.memory.textures)
            console.log("Geometries in Memory", renderer.info.memory.geometries)
        }


        // (startpos, startcolor, endpos, endcolor )
        // console.log( get_gradient_RGB(0, 0xffffff, 15, 0x000000) );
        //console.log( loadDynamicGradientPalette(examplePalette_april_night) );

        nextStats = now + 5;
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