# This file is part of Shoop Wintergear Demo.
#
# Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
#
# This source code is licensed under the AGPLv3 license found in the
# LICENSE file in the root directory of this source tree.
from django import forms
from shoop.core.models import MutableAddress
from shoop.front.views.basket import DefaultBasketView


class AddressForm(forms.ModelForm):
    class Meta:
        model = MutableAddress
        fields = (
            "name", "phone", "email", "street",
            "street2", "postal_code", "city",
            "region", "country"
        )

    def __init__(self, *args, **kwargs):
        super(AddressForm, self).__init__(*args, **kwargs)
        for field_name in ("email", "postal_code"):
            self.fields[field_name].required = True


class WintergearBasketView(DefaultBasketView):
    shipping_address_form_class = AddressForm
    billing_address_form_class = AddressForm
