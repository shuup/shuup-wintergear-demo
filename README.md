Shoop Wintergear Demo
=====================

This is the Wintergear Demo project for Shoop.

It demonstrates the basic structure, templating and styling for a
basic B2C e-commerce site built on the [Shoop](https://shoop.io) platform.

Copyright
---------

Copyright (C) 2015 by Shoop Ltd. <contact@shoop.io>

Shoop is International Registered Trademark & Property of Shoop Ltd.,
Business ID: FI24815722, Business Address: Aurakatu 12 B, 20100 Turku,
Finland.

License
-------

Shoop Wintergear Demo is published under the GNU Affero General Public
License, version 3 (AGPLv3). See the LICENSE file in the source code
tree.

Some external libraries and contributions bundled with Shoop Wintergear
Demo may be published under other AGPLv3-compatible licenses.  For
these, please refer to VENDOR-LICENSES.md file in the source code tree
or the licenses included within each package.

Getting started
---------------

The Shoop source code should be in the "shoop" directory next to this
README file.  If you have fetched this project from Git, you can use
the `git submodule update --init` command to let Git fetch Shoop for you
into this directory.

For Bash-based shells, this should do:

```bash
pip install -r requirements.txt
python manage.py wintergear_import_demo
npm run build
(cd shoop && npm run build)
```
