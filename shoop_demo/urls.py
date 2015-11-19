# This file is part of Shoop Wintergear Demo.
#
# Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
#
# This source code is licensed under the AGPLv3 license found in the
# LICENSE file in the root directory of this source tree.
import os

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
import shoop.admin.urls
import shoop.front.urls


def _ns_url(regex, urls, name):
    return url(regex, include(urls, namespace=name, app_name=name))


_URLS = [
    _ns_url(r'^sa/', shoop.admin.urls, 'shoop_admin'),
    _ns_url(r'^', shoop.front.urls, 'shoop'),
]

_STATIC_DIRS = [
    'static_src',
    'bower_components',
]

_STATIC_MAP = [
    (settings.MEDIA_URL, settings.MEDIA_ROOT),
] + [('/' + x + '/', os.path.join(settings.BASE_DIR, x)) for x in _STATIC_DIRS]


def _get_statics():
    if not settings.DEBUG:
        return []
    result = []
    for (path, root) in _STATIC_MAP:
        result += static(path, document_root=root)
    return result


urlpatterns = patterns('', *_URLS) + _get_statics()
