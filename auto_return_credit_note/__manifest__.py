# -*- coding: utf-8 -*-

{
    'name': 'Auto Return Credit Note',
    'version': '19.0.1.0.0',
    'category': 'Inventory/Delivery',
    'summary': 'Automatically create draft credit note on delivery/receipt return',
    'description': """
        This module automatically creates a draft credit note or vendor refund 
        when products are returned from a delivery or receipt, matching the 
        returned quantities and original prices.
    """,
    'author': 'Zenovaraa',
    'website': 'https://www.odoo.com',
    'depends': ['stock', 'sale_stock', 'purchase_stock', 'account'],
    'data': [],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'OPL-1',
}
