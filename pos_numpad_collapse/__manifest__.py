# -*- coding: utf-8 -*-
# Part of pos_numpad_collapse. See LICENSE file for full copyright and licensing details.

{
    'name': 'PoS Numpad Collapse Toggle',
    'version': '18.0.1.0.0',
    'summary': 'Add a collapse/expand toggle button for the numpad in the PoS product screen',
    'description': """
PoS Numpad Collapse Toggle
===========================
Adds a small toggle button just above the numpad in the Point of Sale product
screen (left sidebar). Clicking it collapses the numpad section to reclaim
vertical space, and clicking again restores it.

Key behaviours
--------------
* The toggle button is visible **only** when Odoo's built-in numpad-visibility
  condition is satisfied.
* The collapsed/expanded state is independent of Odoo's base flow - Odoo can
  still hide the numpad on its own (e.g. no line selected), and the toggle
  state is preserved for when the numpad would normally reappear.
* No Python models or database changes are required.
    """,
    'category': 'Point of Sale',
    'author': 'Zenovaraa',
    'license': 'OPL-1',
    'depends': ['point_of_sale'],
    'images': ['static/description/cover-image.png'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_numpad_collapse/static/src/**/*',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
}
