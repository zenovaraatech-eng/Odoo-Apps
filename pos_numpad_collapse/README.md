# PoS Numpad Collapse Toggle

**Version:** 18.0.1.0.0  
**Author:** Zenovaraa  
**License:** OPL-1  
**Odoo version:** 18.0  
**Category:** Point of Sale

---

## Overview

This module adds a compact **collapse / expand toggle button** just above the
numpad in the Point of Sale product screen (left sidebar).  Cashiers who want
more vertical space for the order line list can hide the numpad with a single
click and bring it back whenever they need to enter values again.

---

## Features

- **One-click toggle** - a small button with a
  chevron icon appears above the numpad whenever it would normally be visible.
- **Smooth CSS animation** - the toggle chevron rotates smoothly with CSS transitions, and the toggle button styles react dynamically.
- **Independent of Odoo's base flow** - Odoo already hides the numpad when
  the order is empty or no order line is selected.  This module's collapsed
  state works *on top of* that logic, never fighting it:
  - If Odoo's condition says "hide" → numpad hidden (regardless of toggle state).
  - If Odoo's condition says "show" + user collapsed → numpad hidden.
  - If Odoo's condition says "show" + user expanded → numpad shown.
  - **Auto-reset** - The collapsed state resets to expanded automatically if the order is emptied or deselected.

---

## Installation

1. Copy the `pos_numpad_collapse` folder into your Odoo addons path.
2. Restart the Odoo server.
3. In **Apps**, update the module list and install **PoS Numpad Collapse Toggle**.
4. Open a PoS session - the toggle button will appear automatically.

---

## Usage

1. Open a Point of Sale session.
2. Add at least one product to the order and select an order line - the numpad
   appears as usual.
3. Click button with an upward chevron - the numpad
   hides instantly, and the toggle button turns dark with a downward chevron ("Show Numpad").
4. Click **"Show Numpad"** - the numpad expands again.
5. Selecting a different order line while collapsed keeps the numpad hidden.
6. Deselecting all lines hides the toggle button along with the numpad
   (Odoo's base behaviour).

---

## Compatibility

| Odoo | Compatible |
|------|-----------|
| 18.0 | ✅ Yes     |

Compatible with `pos_restaurant` and other standard PoS extensions.