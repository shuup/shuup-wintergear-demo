/**
 * This file is part of Shoop Wintergear Demo.
 *
 * Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
window.activateCheckoutAddressCopy = function(){
    var shouldCopyFields = false;

    var toggleFieldDisability = function($field) {
        $field.toggleClass("disabled", shouldCopyFields);
    };

    var toggleCopyFields = function() {
        shouldCopyFields = $("#same_as_billing").is(":checked");
        $("#shipping :input").each(function(){
            $(this).attr("readonly", shouldCopyFields);
            toggleFieldDisability($(this));
        });

        $("#id_shipping-country").attr("readonly", shouldCopyFields);

        $target = $("#id_shipping-country").next(".btn-group").children("button");
        toggleFieldDisability($target);
        if(shouldCopyFields) {
            $("#billing :input").change();
        }
    };

    var copyFieldValue = function() {
        if(!shouldCopyFields)
            return;
        var targetName = $(this).attr("id").split("-")[1];
        var $target = $("#id_shipping-"+targetName);
        $target.val($(this).val());
    };

    var copySelectValue = function() {
        $("#id_shipping-country").selectpicker("val", $(this).val());
    };

    $("#id_shipping-country").attr("readonly", true);
    toggleCopyFields();
    $(document).on("input change", "#billing :input", copyFieldValue);
    $("#same_as_billing").on("change", toggleCopyFields);
    $("#id_billing-country").on("change", copySelectValue);
};
