class TRGBGradientPaletteEntryUnion
{
    index = 0;
    r = 0;
    g = 0;
    b = 0;
    
    constructor( palette )
    {
        this.set(palette);
    }
}


class CRGBPalette16
{

    // JS does not support overloading... fuuuuuckin' g@y
    constructor()
    {

    }
}


/*
CRGB ColorFromPalette( const CRGBPalette16& pal, uint8_t index, TBlendType blendType)
{
    index = 8-bit groß

    //      hi4 = index >> 4; die höhsten 4 bit behalten, rest löschen 
    uint8_t hi4 = lsrX4(index); -> damit ist der wert iwas zwischen 0 und 15
    uint8_t lo4 = index & 0x0F; -> die niedrisgten 4bit aus index ziehen => Beispiel:
                                    index = 256             index = 96
                                    1111 1111       oder    0110 0101
                                AND 0000 1111           AND 0000 1111
                                =>  0000 1111           =>  0000 0101    
    
    // Berechnung des Indexes aus der gegebenden Palette
    // index >> 4 = 0 - 15, heißt eine Palette die 16bit Groß ist findet man so den aktuellen index
    // quasi also index / 2^4 = aktuelle Farbe bzw. Paletten Index
    

    // const CRGB* entry = &(pal[0]) + hi4;
    // since hi4 is always 0..15, hi4 * sizeof(CRGB) can be a single-byte value,
    // instead of the two byte 'int' that avr-gcc defaults to.
    // So, we multiply hi4 X sizeof(CRGB), giving hi4XsizeofCRGB;
    uint8_t hi4XsizeofCRGB = hi4 * sizeof(CRGB);
    // We then add that to a base array pointer.
    const CRGB* entry = (CRGB*)( (uint8_t*)(&(pal[0])) + hi4XsizeofCRGB);
    
    blend colors?
    uint8_t blend = lo4 && (blendType != NOBLEND);
    
    uint8_t red1   = entry->red;
    uint8_t green1 = entry->green;
    uint8_t blue1  = entry->blue;
    
    
    if( blend ) {
        
        // wenn index das maximum von 256 erreicht dann wrap zum anfang
        // ansonst gehe eine farbe weiter
        if( hi4 == 15 ) {
            entry = &(pal[0]);
        } else {
            ++entry;
        }
        
        // palettenIndex * 16
        // um das beispiel von oben fort zu führen => 5 * 16 = 80
        uint8_t f2 = lo4 << 4;
        // errechne 'negativ' von f2 => 255 - 80 = 175
        uint8_t f1 = 255 - f2;
        
        //    rgb1.nscale8(f1);

        uint8_t red2   = entry->red;
        red1   = scale8_LEAVING_R1_DIRTY( red1,   f1); // red1 * (f1 / 256) => 255 * ( 80 / 256) = 80
        red2   = scale8_LEAVING_R1_DIRTY( red2,   f2); // red2 * (f2 / 256) => 128 * (175 / 256) = 87.5
        red1   += red2; // 80 + 87.5 = 168

        uint8_t green2 = entry->green;
        green1 = scale8_LEAVING_R1_DIRTY( green1, f1);
        green2 = scale8_LEAVING_R1_DIRTY( green2, f2);
        green1 += green2;

        uint8_t blue2  = entry->blue;
        blue1  = scale8_LEAVING_R1_DIRTY( blue1,  f1);
        blue2  = scale8_LEAVING_R1_DIRTY( blue2,  f2);
        blue1  += blue2;
        
        cleanup_R1();
    }
    
    return CRGB( red1, green1, blue1);
}
*/