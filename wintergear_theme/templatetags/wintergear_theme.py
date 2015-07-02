# -*- coding: utf-8 -*-
from django.conf import settings
from django_jinja.library import global_function


@global_function()
def get_demo_credentials():
    return settings.DEMO_CREDENTIALS
