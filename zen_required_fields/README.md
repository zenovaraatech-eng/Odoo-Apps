# Required Field Indicator

> See what Odoo expects from you before you hit save. A clear red asterisk on every required field, on every form.

**Technical name:** `zen_required_fields` · **Version:** 19.0.1.0.0 · **Odoo:** 19.0 · **License:** OPL-1 · **Author:** Zenovaraa

## Overview

Odoo stopped marking required fields, so nobody knows a field was mandatory until they press Save. The save is refused, an error blocks the screen, and whoever just filled in a long form has to go hunting for the one field Odoo is complaining about. On a busy day that is time lost on every quotation, every contact and every product your team creates.

This app puts the indicator back. A red asterisk sits on the label of every required field from the moment the form opens, with a matching marker on the input box, so people fill the record correctly the first time instead of learning the form by trial and error.

## Features

- **Instant Red Asterisk**: Every required field gets an asterisk next to its label as soon as the form renders, with no need to attempt a save first.
- **Marked Input Box**: A thin colored marker runs down the left edge of the required input, so the field is identifiable even where its label is not rendered.
- **Follows Conditional Fields**: Fields that become required only under certain conditions pick up the asterisk the moment they flip, and lose it again when they stop being required.
- **Zero Configuration**: Install and you are done. It applies to every backend form view automatically, with no view inheritance and no per-field setup.
- **Safe by Design**: Pure web assets (SCSS and JS), no server models and no data changes. It keys off public DOM classes only, so it stays resilient across Odoo updates.

## Installation

1. Copy `zen_required_fields/` into your Odoo addons path.
2. Restart the Odoo service and update the apps list (*Apps → Update Apps List*, developer mode).
3. Search for **Required Field Indicator** and click *Install*.

**Depends on:** `web`

## Usage

1. **Install the App**: Install from the Apps menu. There is nothing to configure and no view to modify, the indicator is active immediately.
2. **Open Any Form**: Create a contact, a quotation, a product. Every mandatory field now carries its asterisk and its input marker before you touch anything.
3. **Watch It Follow the Form**: Change a field that makes another one mandatory and the asterisk appears on the spot, without a reload.

## FAQ

**What does this actually save my team?**
The re-work that happens after a rejected save. Today someone fills a long form, presses Save, gets blocked by a validation error and has to find the field Odoo wants. With the asterisks in place they see the mandatory fields before they start typing. Fewer failed saves, fewer half-finished records, and new staff learn your forms without being walked through them.

**Will it work on our screens, including the customised ones?**
Yes. Every backend form gets the indicator automatically, whether it is a standard Odoo screen, a form added by another app from the Store, or one your team customised. There is nothing to switch on per screen, per field or per user, and nothing for anyone to configure after installation.

**Can we change how the indicator looks?**
Not in this app. The free version shows a fixed red asterisk, which is the convention people already recognise from other business software. If you want the indicator to follow your own house style, **Required Field Indicator: Pro** adds a settings screen to choose the color, size and position, highlight fields while they are still empty, and mark required columns in list and order-line tables as well.

**Is there any risk to our data?**
None. The app only changes how forms are displayed. It adds no fields, stores nothing in your database and never touches a record. If you uninstall it, every screen returns to standard Odoo exactly as it was.

## Technical notes

- Front-end only: one SCSS file and one JS service registered in `web.assets_backend`. There is no Python model, no `ir.model.access.csv` row and nothing written to the database.
- The JS registers a single `services` registry entry that runs one `MutationObserver` on `document.body`, batched through `requestAnimationFrame`, so a burst of DOM updates costs one pass rather than one pass per mutation.
- Labels are located with `label[for="<widget id>"]` and the field is detected through the long-stable `o_required_modifier` class rather than internal OWL component APIs, which is what keeps it working across Odoo point releases. The marking pass is wrapped in a try/catch: a cosmetic enhancement must never break the UI.
- Configuration is deliberately absent from this app: it ships one fixed indicator that works everywhere. Anything tunable (asterisk color, size and position, empty-field highlight, required columns in list and tree views) lives in the Pro add-on rather than growing a settings screen here.

## Compatibility

Odoo 19.0: Community & Enterprise. Odoo Online, Odoo.sh and On-Premise.

## Support

- **Company:** Zenovaraa
- **Email:** info@zenovaraa.com
- **Website:** www.zenovaraa.com
- **LinkedIn:** linkedin.com/company/zenovaraa

## License

Odoo Proprietary License v1.0 (OPL-1).
