# -*- coding: utf-8 -*-
# This file is part of Shoop Wintergear Demo.
#
# Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
#
# This source code is licensed under the AGPLv3 license found in the
# LICENSE file in the root directory of this source tree.

from django.conf import settings
from django_jinja.library import global_function


@global_function()
def get_demo_credentials():
    return settings.DEMO_CREDENTIALS
