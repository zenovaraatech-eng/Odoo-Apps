/*
 * Portal Column Toggle
 *
 * Adds a small gear (⚙) control at the top-right of each list table on the customer portal
 * (/my/...) pages, letting each visitor show/hide columns. A badge shows how many columns are
 * hidden, and "Reset to default" restores them all. The choice is stored per page in the
 * browser (localStorage) so it persists on the next visit. Nothing is sent to the server.
 *
 * Written as a plain, framework-agnostic script (no OWL / public-widget dependency) so it
 * stays resilient across Odoo versions. It only touches portal pages and never throws into
 * the page, because a cosmetic feature must not break the portal.
 */
(function () {
    "use strict";

    var STORAGE_PREFIX = "zenPortalCols:";

    function isPortalPage() {
        return /^\/my(\/|$)/.test(window.location.pathname);
    }

    function getHeaderCells(table) {
        var headRow = table.querySelector("thead > tr");
        return headRow ? Array.prototype.slice.call(headRow.children) : [];
    }

    function storageKey(tableIndex, headers) {
        var labels = headers
            .map(function (h) { return (h.textContent || "").trim(); })
            .join("|");
        return STORAGE_PREFIX + window.location.pathname + "#" + tableIndex + "#" + labels;
    }

    function loadHidden(key) {
        try {
            var raw = window.localStorage.getItem(key);
            var parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function saveHidden(key, arr) {
        try {
            if (arr.length) {
                window.localStorage.setItem(key, JSON.stringify(arr));
            } else {
                window.localStorage.removeItem(key);
            }
        } catch (e) {
            // Storage may be unavailable (private mode); toggling still works for the session.
        }
    }

    // Cells are addressed by *grid column*, not by child index: portal tables use colspan
    // (grouped lists have a header cell spanning 2 and group rows spanning 5+), so the nth
    // header cell is rarely the nth cell of a data row. Every cell's untouched colspan is
    // cached once, because we rewrite colSpan as columns are hidden.
    function originalSpan(cell) {
        var cached = cell.getAttribute("data-zen-span");
        if (cached === null) {
            cached = String(cell.colSpan || 1);
            cell.setAttribute("data-zen-span", cached);
        }
        return parseInt(cached, 10) || 1;
    }

    // Grid range [start, start + span) occupied by each header cell.
    function headerRanges(headers) {
        var ranges = [];
        var col = 0;
        headers.forEach(function (th) {
            var span = originalSpan(th);
            ranges.push({ start: col, span: span });
            col += span;
        });
        return ranges;
    }

    // Recompute the whole table from the hidden set rather than toggling incrementally, so
    // repeated show/hide can never drift a colspan out of sync.
    function applyHidden(table, headers, hiddenIdx) {
        var ranges = headerRanges(headers);
        var hiddenCols = {};
        hiddenIdx.forEach(function (idx) {
            var r = ranges[idx];
            if (!r) {
                return;
            }
            for (var g = r.start; g < r.start + r.span; g++) {
                hiddenCols[g] = true;
            }
        });

        var rows = table.querySelectorAll("tr");
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].children;
            var col = 0;
            for (var c = 0; c < cells.length; c++) {
                var cell = cells[c];
                var span = originalSpan(cell);
                var covered = 0;
                for (var g = col; g < col + span; g++) {
                    if (hiddenCols[g]) {
                        covered++;
                    }
                }
                if (covered >= span) {
                    // Portal templates tag responsive columns with Bootstrap's d-*-table-cell
                    // utilities, which are !important, so a plain inline style loses to them.
                    cell.style.setProperty("display", "none", "important");
                } else {
                    cell.style.removeProperty("display");
                    // A cell only partly covered (a group-row label spanning the hidden column)
                    // shrinks instead of disappearing, keeping the row aligned to the grid.
                    if (span > 1) {
                        cell.colSpan = span - covered;
                    }
                }
                col += span;
            }
        }
    }

    function buildControl(table, tableIndex) {
        var headers = getHeaderCells(table);
        if (headers.length < 2) {
            return;
        }

        var key = storageKey(tableIndex, headers);
        var hidden = loadHidden(key);
        var inputs = [];

        // Re-apply the visitor's saved choice.
        applyHidden(table, headers, hidden);

        // --- Bar (full width) so the gear sits at the table's top-right. ---
        var bar = document.createElement("div");
        bar.className = "zen-col-toggle-bar";

        var wrapper = document.createElement("div");
        wrapper.className = "zen-col-toggle";

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-sm btn-outline-secondary zen-col-toggle-btn";
        btn.title = "Show / hide columns";
        btn.setAttribute("aria-label", "Show or hide columns");
        btn.innerHTML = '<i class="fa fa-cog" aria-hidden="true"></i>';

        var badge = document.createElement("span");
        badge.className = "zen-col-toggle-badge badge rounded-pill text-bg-primary";
        btn.appendChild(badge);

        function updateBadge() {
            var n = hidden.length;
            badge.textContent = n ? String(n) : "";
            badge.style.display = n ? "" : "none";
        }

        var menu = document.createElement("div");
        menu.className = "zen-col-toggle-menu";
        menu.hidden = true;

        var title = document.createElement("div");
        title.className = "zen-col-toggle-title";
        title.textContent = "Show columns";
        menu.appendChild(title);

        headers.forEach(function (th, index) {
            var label = (th.textContent || "").trim() || ("Column " + (index + 1));
            var inputId = "zen-col-" + tableIndex + "-" + index;

            var check = document.createElement("div");
            check.className = "form-check";

            var input = document.createElement("input");
            input.type = "checkbox";
            input.className = "form-check-input";
            input.id = inputId;
            input.checked = hidden.indexOf(index) === -1;
            inputs[index] = input;

            input.addEventListener("change", function () {
                var pos = hidden.indexOf(index);
                if (input.checked) {
                    if (pos !== -1) {
                        hidden.splice(pos, 1);
                    }
                } else if (pos === -1) {
                    hidden.push(index);
                }
                applyHidden(table, headers, hidden);
                saveHidden(key, hidden);
                updateBadge();
            });

            var lab = document.createElement("label");
            lab.className = "form-check-label";
            lab.setAttribute("for", inputId);
            lab.textContent = label;

            check.appendChild(input);
            check.appendChild(lab);
            menu.appendChild(check);
        });

        // --- Reset to default ---
        var resetWrap = document.createElement("div");
        resetWrap.className = "zen-col-toggle-reset";
        var reset = document.createElement("button");
        reset.type = "button";
        reset.className = "btn btn-link btn-sm p-0";
        reset.textContent = "Reset to default";
        reset.addEventListener("click", function () {
            hidden.length = 0;
            headers.forEach(function (th, index) {
                if (inputs[index]) {
                    inputs[index].checked = true;
                }
            });
            applyHidden(table, headers, hidden);
            saveHidden(key, hidden);
            updateBadge();
        });
        resetWrap.appendChild(reset);
        menu.appendChild(resetWrap);

        btn.addEventListener("click", function (ev) {
            ev.stopPropagation();
            menu.hidden = !menu.hidden;
        });

        document.addEventListener("click", function (ev) {
            if (!wrapper.contains(ev.target)) {
                menu.hidden = true;
            }
        });

        updateBadge();

        wrapper.appendChild(btn);
        wrapper.appendChild(menu);
        bar.appendChild(wrapper);
        table.parentNode.insertBefore(bar, table);
    }

    function init() {
        if (!isPortalPage()) {
            return;
        }
        var scope = document.querySelector("main") || document.getElementById("wrap") || document.body;
        if (!scope) {
            return;
        }
        var tables = scope.querySelectorAll("table");
        var qualifyingIndex = 0;
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            if (table.dataset.zenColToggle) {
                continue;
            }
            if (!table.querySelector("thead > tr")) {
                continue;
            }
            table.dataset.zenColToggle = "1";
            try {
                buildControl(table, qualifyingIndex);
            } catch (e) {
                // Never break the portal over a cosmetic control.
            }
            qualifyingIndex++;
        }
    }

    if (document.readyState !== "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
