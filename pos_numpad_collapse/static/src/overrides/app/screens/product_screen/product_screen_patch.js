/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { useState, useEffect } from "@odoo/owl";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";

patch(ProductScreen.prototype, {
    setup() {
        super.setup(...arguments);

        this.numpadToggleState = useState({
            isNumpadCollapsed: false,
        });

        // Make state globally accessible to ControlButtons
        this.pos.numpadToggleState = this.numpadToggleState;

        // Automatically reset the collapsed state when no orderline is selected
        useEffect(
            (selectedUuid) => {
                if (!selectedUuid) {
                    this.numpadToggleState.isNumpadCollapsed = false;
                }
            },
            () => [this.pos.get_order()?.uiState.selected_orderline_uuid]
        );
    },

    get dynamicNumpadClass() {
        // Return 'd-none' if collapsed to hide the numpad
        // Otherwise return Odoo's base class for Numpad
        return this.numpadToggleState.isNumpadCollapsed ? 'd-none' : 'd-grid m-n1';
    }
});

patch(ControlButtons.prototype, {
    toggleNumpad() {
        if (this.pos.numpadToggleState) {
            this.pos.numpadToggleState.isNumpadCollapsed = !this.pos.numpadToggleState.isNumpadCollapsed;
        }
    }
});
