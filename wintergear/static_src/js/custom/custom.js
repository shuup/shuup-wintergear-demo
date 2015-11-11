/**
 * This file is part of Shoop Wintergear Demo.
 *
 * Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

function updatePrice() {
    var $quantity = $("#product-quantity");
    if ($quantity.length === 0 || !$quantity.is(":valid")) {
        return;
    }

    var data = {
        id: $("input[name=product_id]").val(),
        quantity: $quantity.val()
    };
    var $simpleVariationSelect = $("#product-variations");
    if ($simpleVariationSelect.length > 0) {
        // Smells like a simple variation; use the selected child's ID instead.
        data.id = $simpleVariationSelect.val();
    } else {
        // See if we have variable variation select boxes; if we do, add those.
        $("select.variable-variation").serializeArray().forEach(function(obj) {
            data[obj.name] = obj.value;
        });
    }
    jQuery.ajax({url: "/xtheme/product_price", dataType: "html", data: data}).done(function(responseText) {
        var $content = jQuery("<div>").append(jQuery.parseHTML(responseText)).find("#product-price-div");
        jQuery("#product-price-div").replaceWith($content);
        if ($content.find("#no-price").length > 0) {
            $("#add-to-cart-button").prop("disabled", true);
        } else {
            $("#add-to-cart-button").not(".not-orderable").prop("disabled", false);
        }
    });
}

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

$(function() {

    $(document).on("change", ".variable-variation, #product-variations, #product-quantity", updatePrice);

    updatePrice();

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
    $(".owl-carousel.five").owlCarousel({
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
    $(".owl-carousel.three").owlCarousel({
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
    $(".owl-carousel.thumbnails").owlCarousel({
        margin: 15,
        nav: $(this).find(".thumb").length > 4,
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

    //Enable carousel slide change by swiping
    $(".carousel-inner").swipe({
        // Swipe handler for swiping left
        swipeLeft: function() {
            $('.frontpage-carousel').carousel('next');
        },
        // Swipe handler for swiping left
        swipeRight: function() {
            $('.frontpage-carousel').carousel('prev');
        },
        fallbackToMouseEvents: false,
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > 400) {
            $("#scroll_top").addClass('visible');
        } else {
            $("#scroll_top").removeClass('visible');
        }
    });
});
