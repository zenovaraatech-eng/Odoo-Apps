/** @odoo-module **/

import { registry } from "@web/core/registry";

/**
 * Required Field Indicator — required-field indicator.
 *
 * Odoo marks required fields on the widget with the (long-stable) `o_required_modifier`
 * class, but does not put any indicator on the field's *label* until you try to save.
 * This service adds a `o_zen_required` marker class to the label of every required field
 * so the SCSS can render a red asterisk. It deliberately relies only on public DOM classes
 * (not internal OWL component APIs) to stay resilient across Odoo versions.
 */

function markRequiredLabels(root) {
    if (!root || !root.querySelectorAll) {
        return;
    }
    const stillRequired = new Set();

    for (const widget of root.querySelectorAll(".o_field_widget.o_required_modifier")) {
        const holder = widget.querySelector("input[id], select[id], textarea[id], [id]");
        const id = holder && holder.getAttribute("id");
        if (!id) {
            continue;
        }
        let label;
        try {
            label = root.querySelector(`label[for="${CSS.escape(id)}"]`);
        } catch (e) {
            continue;
        }
        if (label) {
            stillRequired.add(label);
            // Only mutate when needed, so we never trigger our own observer in a loop.
            if (!label.classList.contains("o_zen_required")) {
                label.classList.add("o_zen_required");
            }
        }
    }

    // Clear the marker from labels whose field is no longer required (dynamic modifiers).
    for (const label of root.querySelectorAll("label.o_zen_required")) {
        if (!stillRequired.has(label)) {
            label.classList.remove("o_zen_required");
        }
    }
}

const zenRequiredFieldIndicatorService = {
    start() {
        let scheduled = false;
        const schedule = () => {
            if (scheduled) {
                return;
            }
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                try {
                    markRequiredLabels(document.body);
                } catch (e) {
                    // A cosmetic enhancement must never break the UI.
                }
            });
        };

        const observer = new MutationObserver(schedule);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"],
        });

        schedule();
    },
};

registry.category("services").add("zen_required_field_indicator", zenRequiredFieldIndicatorService);
