# Portal Column Toggle

> Let portal users show only the columns they actually need.

**Technical name:** `zen_portal_column_toggle` · **Version:** 19.0.1.0.0 · **Odoo:** 19.0 · **License:** OPL-1 · **Author:** Zenovaraa

## Overview

My Orders, My Invoices, My Quotations: every portal list shows a fixed set of columns, and your customer cannot do a thing about the ones they do not care about. On a phone that means a cramped, unreadable table. This app puts a small gear above every portal list so each visitor picks the columns they want, and the portal remembers their choice the next time they log in.

## Features

- **A Gear on Every Table.** A small gear control appears at the top-right of each portal list table. Tick and untick columns to show or hide them instantly, with no page reload.
- **Hidden Count & Reset.** A badge on the gear shows how many columns are currently hidden, and *Reset to default* brings them all back in one click.
- **Remembered Next Visit.** Each visitor's choice is stored per page in their own browser, so the portal looks the way they left it.
- **Works Everywhere in the Portal.** Any `/my/…` page with a proper table header gets the gear automatically, including list pages added by other apps and grouped lists such as Tasks grouped by project. Nothing to configure per model.
- **Nothing Sent to the Server.** Purely front-end: no server model, no stored preference, no personal data. One customer's layout never affects another's.

## Installation

1. Copy `zen_portal_column_toggle/` into your Odoo addons path.
2. Restart the Odoo service and update the apps list (*Apps → Update Apps List*, developer mode).
3. Search for **Portal Column Toggle** and click *Install*.

**Depends on:** `portal`

## Usage

1. **Open a Portal List.** Log in to the portal and open My Orders, My Invoices or any other document list under My Account.
2. **Click the Gear.** The gear at the top-right of the table opens the column list, with a badge showing how many columns are hidden.
3. **Pick Your Columns.** Untick what you do not need. The table updates immediately and remembers the choice for next time.

## FAQ

**Does a customer's column choice follow them to another device or browser?**
No. The choice lives in that browser's `localStorage`, so it is per browser and per device. Logging in from a phone or a different browser starts from the default columns again, and clearing site data resets it. This is deliberate: nothing about the visitor is written to your database.

**Does it work on portal pages added by other apps?**
Yes. The script does not target specific models; it picks up any table with a `<thead>` row and at least two columns on a `/my/…` page. Helpdesk tickets, subscriptions, repairs or a custom portal list all get the gear with no extra configuration.

**Does hiding a column change the PDF, the download, or what the customer can access?**
No. Hiding is display-only on the HTML table. Printed reports, downloaded documents and record access rules are untouched. This app grants and removes nothing in terms of permissions.

**What happens when the module is uninstalled?**
The assets stop loading and the portal returns to its standard tables immediately. No database records are created by this app, so there is nothing to clean up. The leftover `zenPortalCols:` keys in a visitor's browser are inert and are dropped when they clear site data.

## Technical notes

- Front-end only: one SCSS file and one plain JS file loaded into `web.assets_frontend`. `__init__.py` is intentionally empty, so there are no Python models and no `security/ir.model.access.csv` to maintain.
- The `localStorage` key is `zenPortalCols:<pathname>#<tableIndex>#<joined header labels>`. Including the header labels means a saved choice is silently discarded when the table's columns change (a module added a column, or the visitor switched language) instead of hiding the wrong column by index.
- Cells are addressed by **grid column**, not by child index. Portal tables use `colspan` freely: a grouped list has a header cell spanning 2 and group-label rows spanning 5, so the *n*th header cell is rarely the *n*th cell of a data row. Each cell's untouched `colspan` is cached in `data-zen-span`, and a cell only partly covered by a hidden column shrinks its `colSpan` instead of disappearing, keeping the row aligned.
- Hiding uses `setProperty("display", "none", "important")`. Portal templates tag responsive columns with Bootstrap's `d-none d-md-table-cell` utilities, which are themselves `!important`, so a plain inline style would lose to them and the column would stay visible.
- The whole table is recomputed from the hidden set on every change rather than toggled incrementally, so repeated show/hide cannot drift a `colspan` out of sync.
- Written framework-agnostic (no OWL or public-widget dependency) so it stays resilient across Odoo versions, and `buildControl` runs inside a `try`/`catch`, because a cosmetic control must never break a portal page.
- Tables are scanned once at `DOMContentLoaded` and marked with `data-zen-col-toggle`. Tables injected later by an AJAX-driven page will not get a gear; that is a deliberate limit rather than a bug.

## Compatibility

Odoo 19.0, Community & Enterprise. Odoo Online, Odoo.sh and On-Premise.

## Support

- **Company:** Zenovaraa
- **Email:** info@zenovaraa.com
- **Website:** www.zenovaraa.com
- **LinkedIn:** linkedin.com/company/zenovaraa

## License

Odoo Proprietary License v1.0 (OPL-1).
