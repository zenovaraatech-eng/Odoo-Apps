# Auto Return Credit Note

**Version:** 19.0.1.0.0  
**Author:** Zenovaraa
**License:** LGPL-3  
**Odoo version:** 19.0  
**Category:** Inventory/Delivery

---

## Overview

This module automates the financial workflow around stock returns. Whenever a 
delivery to a customer or a receipt from a vendor is returned, the module automatically
creates a drafted Credit Note (for sales) or Vendor Refund (for purchases) matching
the exact products and quantities that were physically returned.

---

## Features

- **Automated Credit Note Creation** - Validating a return picking instantly generates a drafted credit note.
- **Accurate Pricing Extraction** - It automatically looks up the posted invoice/bill associated with the original order line and copies the exact `price_unit` and `tax_ids` previously used, ensuring the refund is 100% accurate.
- **Partial Return Support** - The generated refund strictly conforms to the exact `quantity` returned, handling partial returns gracefully.
- **Strict Edge-Case Handling** - Automatically identifies if a return is actually moving goods back to inventory/supplier, ignoring "return of returns" to avoid false refunds.

---

## Installation

1. Copy the `auto_return_credit_note` folder into your Odoo addons path.
2. Restart the Odoo server.
3. In **Apps**, update the module list and install **Auto Return Credit Note**.

---

## Usage

1. Complete a standard Sale Order or Purchase Order workflow (Validate Delivery/Receipt, Create and Post Invoice/Bill).
2. Go to the validated Delivery or Receipt and click **Return**.
3. Specify the quantities to return and validate the generated Return Picking.
4. Navigate to the original Order or the Accounting app.
5. You will see a newly generated Draft Credit Note / Refund matching the returned items perfectly.

---

## Compatibility

| Odoo | Compatible |
|------|-----------|
| 19.0 | ✅ Yes     |
