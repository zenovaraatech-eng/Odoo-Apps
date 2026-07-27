{
    'name': 'Portal Column Toggle',
    'version': '19.0.1.0.0',
    'summary': 'Let portal users show only the columns they actually need',
    'description': """
Portal Column Toggle
====================

On the customer **portal** (My Orders, My Invoices, My Quotations, ...) the list tables
show a fixed set of columns with no way to hide the ones a customer does not care about.

This app adds a small **gear (⚙) control** at the top-right of each portal list table. Each
visitor can tick/untick columns to show or hide them; a badge shows how many are hidden and
**Reset to default** restores them all. Their choice is remembered (per page, in the browser)
for next time.

* Works on the standard portal document list pages.
* Purely front-end (SCSS + JS), no server models, no configuration.
* Each visitor controls their own view; nothing is stored on the server.
    """,
    'category': 'Website/Portal',
    'author': 'Zenovaraa',
    'license': 'OPL-1',
    # Cover image (thumbnail) on the Apps Store listing. The store reads it from this key
    # only -- an image sitting in static/description/ is never picked up on its own.
    'images': ['static/description/zen_portal_column_toggle_banner.png'],
    'depends': ['portal'],
    'assets': {
        'web.assets_frontend': [
            'zen_portal_column_toggle/static/src/scss/portal_column_toggle.scss',
            'zen_portal_column_toggle/static/src/js/portal_column_toggle.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
