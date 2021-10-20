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


/*
 *  Trickery Trick Tricks
 */
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);



/*
 *  jQuery
 */
$(function()
{
    console.log("is Model loaded: " + isModelLoaded);

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
    var grid = document.querySelector('#gallery-container');

    var msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
    });

    // imagesLoaded helper
    imagesLoaded( grid ).on( 'progress', function() {
        // layout Masonry after each image loads
        msnry.layout();
    });



    /*
     *  Fade-In content that has class "scroll-fade-in" when it is in viewport
     *   
     *  probably raplacing this below to this lib (https://github.com/michalsnik/aos) later 
     */
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
});