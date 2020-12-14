/*---------------------------
      Table of Contents
    --------------------
    
    01- Mobile Menu
    02- Sticky Navbar
    03- Module Search 
    04- Module Sidenav 
    05- Scroll Top Button
    06- Equal Height Elements
    07- Set Background-img to section 
    08- Add active class to accordions
    09- Load More Items
    10- Add Animation to About Img
    11- Owl Carousel
    12- Popup Video
    13- CounterUp
    14- Projects Filtering and Sorting
     
 ----------------------------*/

$(function () {

    // Global variables
    var $win = $(window);

    /*==========   Mobile Menu   ==========*/
    var $navToggler = $('.navbar-toggler');
    $navToggler.on('click', function () {
        $(this).toggleClass('actived');
    })
    $navToggler.on('click', function () {
        $('.navbar-collapse').toggleClass('menu-opened');
    })

    /*==========   Sticky Navbar   ==========*/
    $win.on('scroll', function () {
        if ($win.width() >= 992) {
            var $navbar = $('.navbar');
            if ($win.scrollTop() > 80) {
                $navbar.addClass('fixed-navbar');
            } else {
                $navbar.removeClass('fixed-navbar');
            }
        }
    });

    /*==========  Module Sidenav   ==========*/
    var $moduleBtnSidenav = $('.module__btn-sidenav'),
        $moduleSidenavContainer = $('.module__sidenav-container')
    // Show Module Sidenav
    $moduleBtnSidenav.on('click', function (e) {
        e.preventDefault();
        $moduleSidenavContainer.toggleClass('active', 'inActive').removeClass('inActive');
    });
    // Close Module Sidenav
    $('.close-sidenav').on('click', function () {
        $moduleSidenavContainer.removeClass('active').addClass('inActive');
    });
    // Close Module Sidenav when clicking on an other place on the Document
    $(document).on('mouseup', function (e) {
        if (!$('.sidenav__menu').is(e.target) && !$moduleBtnSidenav.is(e.target) && $('.sidenav__menu').has(e.target).length === 0 && $moduleBtnSidenav.has(e.target).length === 0) {
            $moduleSidenavContainer.removeClass('active');
        }
    });

    /*==========   Equal Height Elements   ==========*/
    var maxHeight = 0;
    $(".equal-height").each(function () {
        if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
    });
    $(".equal-height").height(maxHeight);


    /*==========   Set Background-img to section   ==========*/
    $('.bg-img').each(function () {
        var imgSrc = $(this).children('img').attr('src');
        $(this).parent().css({
            'background-image': 'url(' + imgSrc + ')',
            'background-size': 'cover',
            'background-position': 'center',
        });
        $(this).parent().addClass('bg-img');
        $(this).remove();
    });


    /*==========   Add active class to accordions   ==========*/
    $('.accordion__item-header').on('click', function () {
        $(this).addClass('opened')
        $(this).parent().siblings().find('.accordion__item-header').removeClass('opened')
    })
    $('.accordion__item-title').on('click', function (e) {
        e.preventDefault()
    });

    /*==========   Load More Items  ==========*/
    function loadMore(loadMoreBtn, loadedItem) {
        $(loadMoreBtn).on('click', function (e) {
            e.preventDefault();
            $(this).fadeOut();
            $(loadedItem).fadeIn();
        })
    }

    loadMore('.loadMoreBlog', '.hidden-blog-item');
    loadMore('.loadMoreServices', '.hidden-service');
    loadMore('.loadMoreProjects', '.project-hidden > .project-item');

    /*==========   Add Animation to About Img ==========*/
    if ($(".about").length > 0) {
        $(window).on('scroll', function () {
            var skillsOffset = $(".about").offset().top - 200,
                skillsHight = $(this).outerHeight(),
                winScrollTop = $(window).scrollTop();
            if (winScrollTop > skillsOffset - 1 && winScrollTop < skillsOffset + skillsHight - 1) {
                $('.about__img').addClass('animate-img');
            }
        });
    }

    /*==========   Owl Carousel  ==========*/
    $('.carousel').each(function () {
        $(this).owlCarousel({
            nav: $(this).data('nav'),
            dots: $(this).data('dots'),
            loop: $(this).data('loop'),
            margin: $(this).data('space'),
            center: $(this).data('center'),
            dotsSpeed: $(this).data('speed'),
            autoplay: $(this).data('autoplay'),
            transitionStyle: $(this).data('transition'),
            animateOut: $(this).data('animate-out'),
            animateIn: $(this).data('animate-in'),
            autoplayTimeout: 15000,
            responsive: {
                0: {
                    items: 1,
                },
                400: {
                    items: $(this).data('slide-sm'),
                },
                700: {
                    items: $(this).data('slide-md'),
                },
                1000: {
                    items: $(this).data('slide'),
                }
            }
        });
    });
    // Owl Carousel With Thumbnails
    $('.thumbs-carousel').owlCarousel({
        thumbs: true,
        thumbsPrerendered: true,
        loop: true,
        margin: 0,
        autoplay: $(this).data('autoplay'),
        nav: $(this).data('nav'),
        dots: $(this).data('dots'),
        dotsSpeed: $(this).data('speed'),
        transitionStyle: $(this).data('transition'),
        animateOut: $(this).data('animate-out'),
        animateIn: $(this).data('animate-in'),
        autoplayTimeout: 15000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });

    /*==========  Popup Video  ==========*/
    $('.popup-video').magnificPopup({
        mainClass: 'mfp-fade',
        removalDelay: 0,
        preloader: false,
        fixedContentPos: false,
        type: 'iframe',
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '</div>',
            patterns: {
                youtube: {
                    index: 'youtube.com/',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1'
                }
            },
            srcAction: 'iframe_src',
        }
    });

    /*==========   counterUp  ==========*/
    $(".counter").counterUp({
        delay: 10,
        time: 4000
    });

    /*==========   Projects Filtering and Sorting  ==========*/
    $("#filtered-items-wrap").mixItUp();
    $(".projects-filter li a").on("click", function (e) {
        e.preventDefault();
    });

});