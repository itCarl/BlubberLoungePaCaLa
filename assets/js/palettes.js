// Palettes can be declared in many different ways
// var myColorfulPalette = [
// 
// 
// 
// 
// 
//  
// ];




let colors = [
    0xff0000, 
    0x00ff00, 
    0x0000ff, 
    0x676b37, 
    0xc28829, 
    0xfe0c7c
];


// example test palette
// [ Index, r, g, b ]
var examplePalette = [
    [  0, 184,  4,  0], //red
    [ 60, 184,  4,  0],
    [ 65, 144, 44,  2], //amber
    [125, 144, 44,  2],
    [130,   4, 96,  2], //green
    [190,   4, 96,  2],
    [195,   7,  7, 88], //blue
    [255,   7,  7, 88]
];

// doesn't work somehow
// does not translate to a 16 entry palette
var examplePalette2_CR9_new = [
    [  0, 255,   5,   0], //red
    [ 60, 255,   5,   0],
    [ 61, 196,  57,   2], //amber (start 61?)
    [120, 196,  57,   2], 
    [120,   6, 126,   2], //green (start 126?)
    [180,   6, 126,   2],
    [180,   4,  30, 114], //blue (start 191?)    
    [255,   4,  30, 114]
];

var examplePalette_black_magenta_red = [
    [0,   0,  0,  0],
    [63,  42,  0, 45],
    [127, 255,  0,255],
    [191, 255,  0, 45],
    [255, 255,  0,  0]
];

// doesn't work somehow
// does not translate to a 16 entry palette
var examplePalette_hult = [
    [  0, 247,176,247],
    [ 48, 255,136,255],
    [ 89, 220, 29,226],
    [160,   7, 82,178],
    [216,   1,124,109],
    [255,   1,124,109]
];

// does some weird flickering
// translates perfectly to a 16 entry palette
// smooth with THREE.Colors lerp calculations
var examplePalette_t = [
    [  0, 255, 255, 255],
    [255,   0,   0,   0]
];

var examplePalette_april_night = [
    [  0,   1,  5, 45], //deep blue
    [ 10,   1,  5, 45],
    [ 25,   5,169,175], //light blue
    [ 40,   1,  5, 45],
    [ 61,   1,  5, 45],
    [ 76,  45,175, 31], //green
    [ 91,   1,  5, 45],
    [112,   1,  5, 45],
    [127, 249,150,  5], //yellow
    [143,   1,  5, 45],
    [162,   1,  5, 45],
    [178, 255, 92,  0], //pastel orange
    [193,   1,  5, 45],
    [214,   1,  5, 45],
    [229, 223, 45, 72], //pink
    [244,   1,  5, 45],
    [255,   1,  5, 45]
];




















/***************************************************************************
 *
 *      16bit palettes
 * 
 ***************************************************************************/
let party = [
    [   0,  85,   0, 171 ],
    [  17, 132,   0, 124 ],
    [  34, 181,   0,  75 ],
    [  51, 229,   0,  27 ],
    [  68, 232,  23,   0 ],
    [  85, 184,  71,   0 ],
    [ 102, 171, 119,   0 ],
    [ 119, 171, 171,   0 ],
    [ 136, 171,  85,   0 ],
    [ 153, 221,  34,   0 ],
    [ 170, 242,   0,  14 ],
    [ 187, 194,   0,  62 ],
    [ 204, 143,   0, 113 ],
    [ 221,  95,   0, 161 ],
    [ 238,  47,   0, 208 ],
    [ 255,   0,   7, 249 ]
];

/*let party = [
    0x5500ab, // 85, 0, 171
    0x84007c, // 132, 0, 124
    0xb5004b, // 181, 0, 75
    0xe5001b, // 229, 0, 27
    0xe81700, // 232, 23, 0
    0xb84700, // 184, 71, 0
    0xab7700, // 171, 119, 0
    0xabab00, // 171, 171, 0
    0xab5500, // 171, 85, 0
    0xdd2200, // 221, 34, 0
    0xf2000e, // 242, 0, 14
    0xc2003e, // 194, 0, 62
    0x8f0071, // 143, 0, 113
    0x5f00a1, // 95, 0, 161
    0x2f00d0, // 47, 0, 208
    0x0007f9  // 0, 7, 249
];

/*
/// HSV color ramp: blue purple ping red orange yellow (and back)
/// Basically, everything but the greens, which tend to make
/// people's skin look unhealthy.  This palette is good for
/// lighting at a club or party, where it'll be shining on people.
extern const TProgmemRGBPalette16 PartyColors_p FL_PROGMEM =
{
    0x5500AB, 0x84007C, 0xB5004B, 0xE5001B,
    0xE81700, 0xB84700, 0xAB7700, 0xABAB00,
    0xAB5500, 0xDD2200, 0xF2000E, 0xC2003E,
    0x8F0071, 0x5F00A1, 0x2F00D0, 0x0007F9
};*/