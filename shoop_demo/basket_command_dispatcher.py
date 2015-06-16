# -*- coding: utf-8 -*-
# This file is part of Shoop Wintergear Demo.
#
# Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
#
# This source code is licensed under the AGPLv3 license found in the
# LICENSE file in the root directory of this source tree.
from shoop.front.basket.command_dispatcher import BasketCommandDispatcher
from django.template.loader import render_to_string


class WintergearBasketCommandDispatcher(BasketCommandDispatcher):

    def postprocess_response(self, command, kwargs, response):

        # When using AJAX-call return the partial shopping-cart.

        if self.ajax:
            partials = response.setdefault("partials", {})
            partials["#navigation-cart"] = render_to_string(
                "shoop/front/basket/partials/_navigation_cart.jinja",
                request=self.request,
            )
        return response
