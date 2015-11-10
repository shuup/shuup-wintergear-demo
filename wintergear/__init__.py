# This file is part of Shoop Wintergear Demo.
#
# Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
#
# This source code is licensed under the AGPLv3 license found in the
# LICENSE file in the root directory of this source tree.

from django.conf import settings
from django.utils.encoding import force_text

from shoop.apps import AppConfig
from shoop.xtheme.theme import Theme


class WintergearTheme(Theme):
    identifier = "shoop.themes.wintergear"
    name = "Shoop Wintergear Demo Theme"
    author = "Juha Kujala"
    template_dir = "wintergear/"

    def get_view(self, view_name):
        import shoop.themes.wintergear.views as views
        return getattr(views, view_name, None)

    def _format_cms_links(self, **query_kwargs):
        if "shoop.simple_cms" not in settings.INSTALLED_APPS:
            return
        from shoop.simple_cms.models import Page
        for page in Page.objects.visible().filter(**query_kwargs):
            yield {"url": "/%s" % page.url, "text": force_text(page)}

    def get_cms_navigation_links(self):
        return self._format_cms_links(visible_in_menu=True)


class WintergearThemeAppConfig(AppConfig):
    name = "shoop.themes.wintergear"
    verbose_name = WintergearTheme.name
    label = "shoop.themes.wintergear"
    provides = {
        "xtheme": "shoop.themes.wintergear:WintergearTheme"
    }


default_app_config = "shoop.themes.wintergear.WintergearThemeAppConfig"
