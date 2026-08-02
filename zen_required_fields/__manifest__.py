{
    'name': 'Required Field Indicator',
    'version': '19.0.1.0.0',
    'summary': 'Show a clear indicator on required fields (asterisk + highlight)',
    'description': """
Required Field Indicator
========================

Since the minimalist redesign, Odoo no longer marks **required fields** until you try to
save. This small, dependency-free app brings back an immediate visual indicator:

* A red asterisk (*) next to the label of every required field.
* A subtle colored marker on the required input itself.

Works out of the box on all backend form views. Pure web assets (SCSS + JS), no server
models, no configuration needed.
    """,
    'category': 'Extra Tools',
    'author': 'Zenovaraa',
    'license': 'OPL-1',
    'depends': ['web'],
    'images': ['static/description/zen_required_fields_banner.png'],
    'assets': {
        'web.assets_backend': [
            'zen_required_fields/static/src/scss/required_fields.scss',
            'zen_required_fields/static/src/js/required_field_indicator.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
