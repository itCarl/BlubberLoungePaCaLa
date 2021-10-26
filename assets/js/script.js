


/*
 *  Animate On Scroll Library initialization
 */
AOS.init({
    disable: 'mobile',
    easing: 'ease-out-back',
    duration: 750,
    mirror: true,
});



/*
 *  jQuery
 */
$(function()
{
    //console.log("is Model loaded: " + isModelLoaded);

    /*
     *  Loading Screen
     */
    if($("#initLoadingscreen").length > 0) //if(isModelLoaded && $("#initLoadingscreen").length > 0) 
    {    
        // when model is loaded (+1.5s) remove the loading screen
        $.when(isModelLoaded).then(function( x ) 
        {
            setTimeout(() => {
            $("#initLoadingscreen").fadeOut('slow', function() 
            {
                $("#initLoadingscreen").remove();
            });

            // allow scrolling
            $("body").removeClass("loading");
            }, 1500);
        });
    }


    /*
     *  Mansory Image loading Fix 
     */
    var $grid = $( '#gallery-container' );
    
    $grid.imagesLoaded(function(){
        $grid.masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
        });

        $('.grid-item img').addClass('not-loaded');
        
        $('.grid-item img.not-loaded').lazyload({
            effect: 'fadeIn',
            load: function() {
                // Disable trigger on this image
                $(this).removeClass("not-loaded");
                $grid.masonry('layout');
            }
        });
        $('.grid-item img.not-loaded').trigger('scroll');
    });

    // imagesLoaded helper
    /*imagesLoaded( grid ).on( 'progress', function(ins, image) {
        // layout Masonry after each image loads
         msnry.layout();
         var result = image.isLoaded ? 'loaded' : 'broken';
         console.log( 'image is ' + result + ' for ' + image.img.src );
    });

    
    const observer = lozad(); // lazy loads elements with default selector as ".lozad"
    observer.observe();

    lozad('.lozad', {
        loaded: function(el) {
            // Custom implementation on a loaded element
            msnry.layout();
        }
    });*/







    /*
     *  Fade-In content that has class "scroll-fade-in" when it is in viewport
     *   
     *  probably raplacing this below to this lib (https://github.com/michalsnik/aos) later 
     */
    /* got replaced by AOS lib
    $(window).scroll(function() {
        $('.scroll-fade-in').each(function() {
            var top_of_element = $(this).offset().top;
            var bottom_of_element = $(this).offset().top + $(this).outerHeight();
            var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
            var top_of_screen = $(window).scrollTop();
            
            if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element) && !$(this).hasClass('is-visible')) {
                $(this).addClass('is-visible');
            }

            // remove it again so that the effect can happen multiple times
            if((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element) && $(this).hasClass('is-visible')) {
                $(this).removeClass('is-visible');
            }
        });

        //$('.scroll-fade-out').css("opacity", 1 - $(window).scrollTop() / 250);

    });
    */
});









/*
 *  Trickery Trick Tricks
 */
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);









/*
 *  'Fancy' console text
 *  some call ist useless... but for us it... it... it's just beautiful.
 */
console.log([
    ' ____  _       _     _                 _                                   ',
    '|  _ \\| |     | |   | |               | |                                 ',
    '| |_) | |_   _| |__ | |__   ___ _ __  | |     ___  _   _ _ __   __ _  ___ ',
    '|  _ <| | | | | \'_ \\| \'_ \\ / _ | \'__| | |    / _ \\| | | | \'_ \\ / _` |/ _ \\',
    '| |_) | | |_| | |_) | |_) |  __| |    | |___| (_) | |_| | | | | (_| |  __/',
    '|____/|_|\\__,_|_.__/|_.__/ \\___|_|    |______\\___/ \\__,_|_| |_|\\__, |\\___|',
    '%c   Die aller \'echte\' Shisha bar in Brandenburg und Umgebung   %c __/ | %c      %c',
    '                                                               |___/      ',
].join( '\n' ), 
"color: #fff; background-color: #343434;font-family: monospace; padding:2px; margin-top: 2px;", 
"color: #000;", 
"background-color: #343434;",
"background-color: transparent;");
