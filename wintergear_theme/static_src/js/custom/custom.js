/**
 * This file is part of Shoop Wintergear Demo.
 *
 * Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
$(function() {

    function product_list_toggle(elem) {
        if (elem.prop("checked")) {
            $(".product-list .products").removeClass("grid").addClass("list");
        } else {
            $(".product-list .products").removeClass("list").addClass("grid");
        }
    }

    function toggleCaption() {
        var caption = $('.frontpage-carousel').find('.item.active').find('.item-caption');
        caption.toggleClass('animate');
    }

    $(document).ready(function() {

        $("#scroll_top").click(function(e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });

        $('.support-nav .dropdown-menu').click(function(e) {
            e.stopPropagation();
        });

        // Set up frontpage carusel
        $('.frontpage-carousel').carousel({
            interval: 6000,
            cycle: true,
            pause: false
        }).on('slid.bs.carousel slide.bs.carousel', toggleCaption).trigger('slid');

        // Set up owl carousel for product list with 5 items
        $(".owl-carousel").owlCarousel({
            margin: 30,
            nav: true,
            navText: [
                '<i class="fa fa-chevron-left"></i>',
                '<i class="fa fa-chevron-right"></i>'
            ],
            responsiveClass: true,
            responsive: {
                0: { // breakpoint from 0 up
                    items : 2,
                },
                640: { // breakpoint from 640 up
                    items : 3,
                },
                992: { // breakpoint from 992 up
                    items : 5,
                }
            }
        });

        // Set up owl carousel for product list with 3 items
        $(".owl-carousel-three").owlCarousel({
            margin: 30,
            nav: true,
            navText: [
                '<i class="fa fa-chevron-left"></i>',
                '<i class="fa fa-chevron-right"></i>'
            ],
            responsiveClass: true,
            responsive: {
                0: { // breakpoint from 0 up
                    items : 1,
                },
                640: { // breakpoint from 640 up
                    items : 2,
                },
                992: { // breakpoint from 992 up
                    items : 3,
                }
            }
        });

        // Set up owl carousel for product page's slider thumbnails.
        $(".owl-carousel-thumbnails").owlCarousel({
            margin: 15,
            nav: $(".owl-carousel-product .thumb").length > 4,
            navText: [
                "<i class='fa fa-chevron-left'></i>",
                "<i class='fa fa-chevron-right'></i>"
            ],
            responsiveClass: true,
            items: 4
        });

        //add tooltip triggers to data-attribute html with data-toggle=tooltip
        $('[data-toggle="tooltip"]').tooltip({
            delay: { "show": 750, "hide": 100 }
        });

        // Add slideDown animation to all bootstrap dropdowns
        $('.dropdown').on('show.bs.dropdown', function() {
            $(this).find('.dropdown-menu').first().stop(true, true).slideDown(200, "easeInSine");
        });

        // Add slideUp animation to all bootstrap dropdowns
        $('.dropdown').on('hide.bs.dropdown', function() {
            $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300, "easeOutSine");
        });

        $('.selectpicker select').selectpicker();

        $(".toggle-view #view_toggler").bind("change", function() {
            product_list_toggle($(this));
        });

        product_list_toggle($(".toggle-view #view_toggler"));

    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > 500) {
            $("#scroll_top").addClass('visible');
        } else {
            $("#scroll_top").removeClass('visible');
        }
    });

    $(function() {
        //Enable carousel slide change by swiping
        $(".carousel-inner").swipe({
            // Swipe handler for swiping left
            swipeLeft:function() {
                $('.frontpage-carousel').carousel('next');
            },
            // Swipe handler for swiping left
            swipeRight:function() {
                $('.frontpage-carousel').carousel('prev');
            },
            fallbackToMouseEvents: false,
        });
    });

}());
