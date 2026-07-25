# Changelog — Auto Return Credit Note

All notable changes to this module will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Version numbers follow `<odoo_major>.<odoo_minor>.<major>.<minor>.<patch>`.

---

## [19.0.1.0.0] — 2026-06-28

### Added
- Initial release for Odoo 19.0.
- Automatic creation of draft credit notes upon validation of Customer Returns.
- Automatic creation of draft vendor refunds upon validation of Vendor Returns.
- Implemented O(N) optimized dictionary mapping to quickly fetch related invoice lines and pricing without nested loops.
