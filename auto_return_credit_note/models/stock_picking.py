# -*- coding: utf-8 -*-

from odoo import models, fields, api, Command, _


class StockPicking(models.Model):
    _inherit = 'stock.picking'

    def _action_done(self):
        """
        Override _action_done to trigger the automatic creation of a 
        draft credit note or vendor refund when a return picking is validated.
        """
        res = super()._action_done()
        for picking in self:
            is_return = picking.return_id or any(m.origin_returned_move_id for m in picking.move_ids)
            if is_return:
                picking._create_auto_credit_note_for_return()
        return res

    def _create_auto_credit_note_for_return(self):
        """
        Identifies if the validated moves in this picking represent actual returns
        (i.e., goods coming back from the customer or returning to the vendor)
        and calls the respective handlers.
        """
        self.ensure_one()

        # Only consider moves that are actually returning to our stock (for sales) or to the vendor (for purchases)
        so_moves = self.move_ids.filtered(
            lambda m: m.sale_line_id and m.state == 'done' and m.location_id.usage == 'customer' and m.quantity > 0
        )
        po_moves = self.move_ids.filtered(
            lambda m: m.purchase_line_id and m.state == 'done' and m.location_dest_id.usage == 'supplier' and m.quantity > 0
        )

        if so_moves:
            self._handle_sale_return(so_moves)
        if po_moves:
            self._handle_purchase_return(po_moves)

    def _handle_sale_return(self, so_moves):
        """
        Processes validated sale return moves, grouping them by sale order,
        and generates draft credit notes fetching the original invoiced prices.
        """
        # Group moves by order
        moves_by_order = {}
        for move in so_moves:
            moves_by_order.setdefault(move.sale_line_id.order_id, []).append(move)

        for order, moves in moves_by_order.items():
            posted_invoices = order.invoice_ids.filtered(
                lambda inv: inv.state == 'posted' and inv.move_type == 'out_invoice'
            )
            if not posted_invoices:
                continue

            # Pre-compute invoice line mapping for fast O(1) lookup
            sale_to_inv_line = {}
            for line in posted_invoices.mapped('invoice_line_ids'):
                for sale_line in line.sale_line_ids:
                    if sale_line.id not in sale_to_inv_line:
                        sale_to_inv_line[sale_line.id] = line

            refund_vals = {
                'move_type': 'out_refund',
                'partner_id': order.partner_invoice_id.id,
                'invoice_origin': order.name,
                'currency_id': order.currency_id.id,
                'company_id': order.company_id.id,
                'journal_id': posted_invoices[0].journal_id.id,
                'invoice_line_ids': [],
            }

            for move in moves:
                sale_line = move.sale_line_id
                inv_line = sale_to_inv_line.get(sale_line.id)

                price_unit = inv_line.price_unit if inv_line else sale_line.price_unit
                tax_ids = inv_line.tax_ids if inv_line else sale_line.tax_ids

                refund_vals['invoice_line_ids'].append(Command.create({
                    'product_id': move.product_id.id,
                    'quantity': move.quantity,
                    'price_unit': price_unit,
                    'tax_ids': [Command.set(tax_ids.ids)] if tax_ids else False,
                    'sale_line_ids': [Command.set([sale_line.id])],
                    'name': sale_line.name or move.product_id.name,
                }))

            if refund_vals['invoice_line_ids']:
                self.env['account.move'].with_context(default_move_type='out_refund').create(refund_vals)

    def _handle_purchase_return(self, po_moves):
        """
        Processes validated purchase return moves, grouping them by purchase order,
        and generates draft vendor refunds fetching the original billed prices.
        """
        # Group moves by order
        moves_by_order = {}
        for move in po_moves:
            moves_by_order.setdefault(move.purchase_line_id.order_id, []).append(move)

        for order, moves in moves_by_order.items():
            posted_bills = order.invoice_ids.filtered(
                lambda inv: inv.state == 'posted' and inv.move_type == 'in_invoice'
            )
            if not posted_bills:
                continue

            # Pre-compute invoice line mapping for fast O(1) lookup
            po_to_inv_line = {}
            for line in posted_bills.mapped('invoice_line_ids'):
                if line.purchase_line_id:
                    po_to_inv_line[line.purchase_line_id.id] = line

            refund_vals = {
                'move_type': 'in_refund',
                'partner_id': order.partner_id.id,
                'invoice_origin': order.name,
                'currency_id': order.currency_id.id,
                'company_id': order.company_id.id,
                'journal_id': posted_bills[0].journal_id.id,
                'invoice_line_ids': [],
            }

            for move in moves:
                po_line = move.purchase_line_id
                inv_line = po_to_inv_line.get(po_line.id)

                price_unit = inv_line.price_unit if inv_line else po_line.price_unit
                tax_ids = inv_line.tax_ids if inv_line else po_line.tax_ids

                refund_vals['invoice_line_ids'].append(Command.create({
                    'product_id': move.product_id.id,
                    'quantity': move.quantity,
                    'price_unit': price_unit,
                    'tax_ids': [Command.set(tax_ids.ids)] if tax_ids else False,
                    'purchase_line_id': po_line.id,
                    'name': po_line.name or move.product_id.name,
                }))

            if refund_vals['invoice_line_ids']:
                self.env['account.move'].with_context(default_move_type='in_refund').create(refund_vals)
