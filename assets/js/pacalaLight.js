/* TODO write some usefull description
 *
 *
 *
 *
 */

import * as THREE from '../three/build/three.module.js';
import * as palettes from '../js/palettes.js';


class pacalaLight 
{
    lights = [];
    liveViewQueue = [];
    fx = 3;
    currentPalette = party;


    constructor( scene ) 
    {   
        this.scene = scene;
        this.sceneElements = this.scene.children;
        this.getLights();
    }

    getLights() 
    {
        var size = this.scene.children.length;

        for(var i=0; i < size; i++) 
        {
            if (this.scene.children[i].name.includes("pl")) 
            {
                this.lights.push(i);    
            }
        }
    }

    update( now, palette ) 
    {        
        var n = [];
        var numLights = this.lights.length;
        var counter = (now * ((255 >> 3) +1)) & 0xFFFF;

        //this.scene.children.forEach(function (e, i) {
        for(var i=0; i < numLights; i++)
        {
            var currentLight = this.sceneElements[this.lights[i]];
            var cc = null;
            
            if(this.fx == 1) 
            {
                var hue = 2 + (i * 8);
                cc = new THREE.Color( "hsl("+ hue  +", 100%, 50%)" );
            } else if(this.fx == 2) 
            {
                cc = new THREE.Color( this.goThroughPalette(i, next, currentLight.color, party) );
            } else if(this.fx == 3) 
            {
                cc = new THREE.Color( this.ColorFromPalette(palette, (i * 255 / (numLights/2)) - counter, true) );
            } else if(this.fx == 4) 
            {
                cc = new THREE.Color( 
                    this.ColorFromPalette(
                        this.loadDynamicGradientPalette( this.currentPalette ), 
                                    ( i * 255 / (numLights/2) ) - counter, 
                                    true
                                ) 
                            );
            }
            

            if(currentLight.name.includes("pl0-0")) {
                //console.log(ColorFromPalette2(party, next, false));
                //console.log(cc.getHex());
                //debugger;
                //var c = new CRGB(255, 128, 255);
                //console.log(c.r);
            }
                    
            n.push(cc.getHex());
            currentLight.color.setHex( Math.abs(cc.getHex()) );
            // set the color of the "helper sphere" over light source
            //currentLight.children[0].material.color.setHex( Math.abs(cc.getHex()) );
        }

        this.liveViewQueue = n;
    }

    updateLiveview() 
    {
        if(document.getElementById( "liveview" ))
        {
            var lw = this.liveViewQueue;
            let e="linear-gradient(90deg,";
            for(var i = 0; i < lw.length; i++ ) {
                var r = (lw[i] >> 16) & 255;
                var g = (lw[i] >>  8) & 255;
                var b =  lw[i]        & 255;
                e += " rgb("+ r +","+ g +","+ b +")";
                e += lw.length-1 == i ? "" : ",";
            };
            e += ")";
            document.getElementById( "liveview" ).style.background=e;
        }
    }











/***************************************************************************
 *
 *      ported fastLed colorutil methods
 *      // http://fastled.io/docs/3.1/colorutils_8h_source.html
 * 
 ***************************************************************************/
    // TODO write some useful description
    /**
     * 
     * 
     * @param {Array}   currentPalette  - 16 entry [index, r, g, b] color palette 
     * @param {number}  colorIndex      - number between 0 ... 255, modulo allows for wrap arround, example: 275 => colorIndex 20
     * @param {boolean} currentBlending - wheter or not to linear blend the colors
     * @returns 
     */
    ColorFromPalette(currentPalette, colorIndex, currentBlending) {
        colorIndex = this.mod(colorIndex, 256);
        var paletteIndex = colorIndex >> 4; // get a number between 0 and 15
        var colorIndexLow4 = colorIndex & 0x0F;

        // console.log(paletteIndex+ " bs shit " +currentPalette[paletteIndex]);

        //var color = currentPalette[paletteIndex<currentPalette.length?paletteIndex:0]; 
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

            //color = currentPalette[paletteIndex<currentPalette.length?paletteIndex:0];
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

    goThroughPalette(index, t, calculatedColor, pal) 
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
    

    // TODO write useful description
    /**
     * This function does some cool stuff... will explain later 
     * 
     * @param {*} gpal 
     * @returns 
     */
    loadDynamicGradientPalette( gpal )
    {
        var i = 0;
        var colors = [];
        var lastSlotUsed = -1;
        
        // get the palette size
        var count = gpal.length;

        // get the first item from palette
        var u = gpal[0];

        var rgbstart = [ u[1], u[2], u[3] ];

        var indexstart = 0;
        var istart8 = 0;
        var iend8 = 0;
        while( indexstart < 255) {
            // get the next item from palette
            i++;
            u = gpal[i];

            // u[0] = index
            var indexend  = u[0];
            var rgbend = [ u[1], u[2], u[3] ];

            // fix floating point shenanigans ps: loose type programming languages suck balls.
            istart8 = Math.floor(indexstart >> 4);
            iend8   = Math.floor(indexend   >> 4);

            // if palette has 16 or more entries then skip this part
            if( count < 16) 
            {
                if( (istart8 <= lastSlotUsed) && (lastSlotUsed < 15)) 
                {
                    istart8 = lastSlotUsed + 1;
                    // ??? to avoid this problem the palette could be sorted first from lower 
                    // ??? to higher indices and duplicates could be deleted
                    // switch higher index with lower index
                    //
                    if( iend8 < istart8) 
                    {
                        iend8 = istart8;
                    }
                }
                lastSlotUsed = iend8;
            }
        
            this.get_gradient_RGB( istart8, rgbstart, iend8, rgbend).forEach((e) => {
                colors.push(new THREE.Color( (e[0] << 16) | (e[1] << 8) | e[2]) );
            });        

            indexstart = indexend;
            rgbstart = rgbend;
        }
        return colors;
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
    get_gradient_RGB(startpos, startcolor, endpos, endcolor )
    {
        var leds = [];

        // passed colors have to be an [r, g, b] array or a hex value
        // FIXME could be changed to THREE.Color or custom class, that handles this
        startcolor = {
            r: Array.isArray(startcolor)? startcolor[0] : startcolor >> 16 & 0xFF,
            g: Array.isArray(startcolor)? startcolor[1] : startcolor >>  8 & 0xFF,
            b: Array.isArray(startcolor)? startcolor[2] : startcolor       & 0xFF,
        };    
        
        endcolor = {
            r: Array.isArray(endcolor)? endcolor[0] : endcolor >> 16 & 0xFF,
            g: Array.isArray(endcolor)? endcolor[1] : endcolor >>  8 & 0xFF,
            b: Array.isArray(endcolor)? endcolor[2] : endcolor       & 0xFF,
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
/***************************************************************************
 *
 *      END ported fastLed colorutil methods
 *      // http://fastled.io/docs/3.1/colorutils_8h_source.html
 * 
 ***************************************************************************/











    // https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
    mod(n, m) {
        return ((n % m) + m) % m;
    }




}






/**
 * Basicly a mix of the fastLED color class and THREE.Color class
 * with extras
 * 
 * 
 * 
 * https://stackoverflow.com/questions/57988296/rgb-0-1-nomenclature
 */
class CRGB extends THREE.Color
{
    constructor(r, g, b)
    {
        super( r, g, b);

        return this.translate01( r, g, b);
    }

    translate01( r, g, b) 
    {
        // make sure that value are in 0 ... 1 format
        // instead of 0 .. 255
        /*
        this.r = Number.isInteger(r) && r > 1 ?  r / 256 : r;
        this.g = Number.isInteger(g) && g > 1 ?  g / 256 : g; 
        this.b = Number.isInteger(b) && b > 1 ?  b / 256 : b;
        */

        this.r = r / 255;
        this.g = g / 255; 
        this.b = b / 255;

        return this;
    }

    /*
    translate0255( r, g, b) 
    {
        // make sure that value are in 0 ... 1 format
        // instead of 0 .. 255
        this.r = r * 255;
        this.g = g * 255; 
        this.b = b * 255;

        return this;
    }
    */

    /*
    get r() 
    {
        return this.r * 255;
    }

    get red() 
    {
        return this.r * 255;
    }

    get g() 
    {
        return this.g * 255;
    }

    get green() 
    {
        return this.g * 255;
    }

    get b() 
    {
        return this.g * 255;
    }

    get blue() 
    {
        return this.g * 255;
    }
    */
}

/*
CRGB.prototype.isColor = true;
CRGB.prototype.r = 1;
CRGB.prototype.g = 1;
CRGB.prototype.b = 1;
*/


class segment 
{
    start;
    stop;
    palette = 0;

    constructor() 
    {

    }


}

export{ pacalaLight };