# -*- coding: utf-8 -*-
# This file is part of Shoop Wintergear Demo.
#
# Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
#
# This source code is licensed under the AGPLv3 license found in the
# LICENSE file in the root directory of this source tree.
from __future__ import unicode_literals
from collections import defaultdict
from django.utils.timezone import now
from shoop.core.models import (
    Shop, SalesUnit, TaxClass,
    Category, CategoryStatus, CategoryVisibility,
    Product, ProductType, ShopProduct,
    ProductMedia, ProductMediaKind,
)
from shoop.simple_cms.models import Page
from shoop.testing.factories import get_default_supplier
from shoop.utils.filer import filer_image_from_data
from shoop.utils.numbers import parse_decimal_string
import datetime
import os
import six
import yaml


def create_from_datum(model, identifier, content, i18n_fields=(), identifier_field="identifier"):
    """
    Create or update an object from a flat datum.

    :param model: Model class
    :param identifier: Object identifier
    :type identifier: str
    :param content: Map of data
    :type content: dict
    :param i18n_fields: List of fields that should be interpreted as i18n
    :type i18n_fields: Iterable[str]
    :param identifier_field: Model field for identifier
    :type identifier_field: str
    :return: Saved model
    """
    content = content.copy()
    if content.get("ignored"):
        return None
    i18n_data = defaultdict(dict)
    normal_data = {}

    # Gather i18n-declared data from the object
    for field in i18n_fields:
        for lang_code, value in content.pop(field, {}).items():
            i18n_data[lang_code][field] = value

    # Gather non-i18n-declared data from the object
    for field, value in content.items():
        if isinstance(value, (int, float, bool)) or isinstance(value, six.string_types):
            if isinstance(value, six.binary_type):
                value = value.decode("UTF-8")
            normal_data[field] = value

    # Retrieve or initialize object
    kwargs = {identifier_field: identifier}
    object = (model.objects.filter(**kwargs).first() or model(**kwargs))

    # Set non-i18n fields
    for field, value in normal_data.items():
        setattr(object, field, value)

    # Set i18n fields
    for lang_code, data in i18n_data.items():
        object.set_current_language(lang_code)
        for field, value in data.items():
            setattr(object, field, value)

    return object


class ProductImporter(object):
    i18n_props = {"name", "description"}

    def __init__(self, image_dir):
        self.image_dir = image_dir
        self.supplier = get_default_supplier()
        self.sales_unit = SalesUnit.objects.first()
        self.tax_class = TaxClass.objects.first()
        self.product_type = ProductType.objects.first()
        self.shop = Shop.objects.first()

    def _attach_image_from_name(self, product, image_name, shop_product):
        image_file = os.path.join(self.image_dir, image_name)
        if not os.path.isfile(image_file):
            print("Image file does not exist: %s" % image_file)
            return
        with open(image_file, "rb") as fp:
            data = fp.read()
        filer_file = filer_image_from_data(None, "WintergearProducts", image_name, data, sha1=True)
        assert filer_file
        image, _ = ProductMedia.objects.get_or_create(product=product, file=filer_file, kind=ProductMediaKind.IMAGE)
        image.shops.add(self.shop)
        product.primary_image = image
        shop_product.shop_primary_image = image

    def _attach_category(self, product, shop_product, category_identifier):
        category = Category.objects.filter(identifier=category_identifier).first()
        if not category:
            print("Category with identifier %r does not exist" % category_identifier)
            return
        product.category = category
        shop_product.primary_category = category
        shop_product.categories.add(category)

    def _import_product(self, sku, data):
        product = create_from_datum(Product, sku, data, self.i18n_props, identifier_field="sku")
        if not product:
            return
        assert isinstance(product, Product)
        product.type = self.product_type
        product.tax_class = self.tax_class
        product.sales_unit = self.sales_unit
        product.full_clean()
        product.save()
        try:
            shop_product = product.get_shop_instance(self.shop)
        except ShopProduct.DoesNotExist:
            price = parse_decimal_string(data.get("price", "9.99"))
            shop_product = ShopProduct.objects.create(product=product, shop=self.shop, default_price_value=price)

        shop_product.suppliers.add(self.supplier)
        for limiter_name in ("limit_shipping_methods", "limit_payment_methods"):
            limiter_val = data.get(limiter_name, ())
            m2m_field = getattr(shop_product, limiter_name.replace("limit_", ""))
            if limiter_val:
                print("%s: Set %s to %s" % (product.sku, limiter_name, limiter_val))
                setattr(shop_product, limiter_name, True)

                for identifier in limiter_val:
                    m2m_field.add(m2m_field.model.objects.get(identifier=identifier))
            else:
                setattr(shop_product, limiter_name, False)
                m2m_field.clear()

        image_name = data.get("image")

        if image_name:
            self._attach_image_from_name(product, image_name, shop_product)

        category_identifier = data.get("category_identifier")

        if category_identifier:
            self._attach_category(product, shop_product, category_identifier)

        shop_product.save()
        product.save()
        print("Product updated: %s" % product.sku)

    def import_products(self, yaml_file):
        with open(yaml_file, "rb") as fp:
            products = yaml.safe_load(fp)

        for sku, data in sorted(products.items()):
            self._import_product(sku, data)


def import_categories(yaml_file):
    with open(yaml_file, "rb") as fp:
        categories = yaml.safe_load(fp)

    i18n_props = {"name", "description"}
    shop = Shop.objects.first()

    for category_identifier, data in sorted(categories.items()):
        category = create_from_datum(Category, category_identifier, data, i18n_props)
        category.status = CategoryStatus.VISIBLE
        category.visibility = CategoryVisibility.VISIBLE_TO_ALL
        category.save()
        category.shops.add(shop)
        print("Category updated: %s" % category.identifier)

    Category.objects.rebuild()


def import_products(yaml_file, image_dir):
    ProductImporter(image_dir).import_products(yaml_file)


def import_cms_content(yaml_file):
    with open(yaml_file, "rb") as fp:
        cms_info = yaml.safe_load(fp)

    i18n_props = {"title", "url", "content"}

    for page_identifier, data in sorted(cms_info.items()):
        page = create_from_datum(Page, page_identifier, data, i18n_props)
        page.available_from = now() - datetime.timedelta(days=1)
        page.save()
        print("Page updated: %s" % page.identifier)
