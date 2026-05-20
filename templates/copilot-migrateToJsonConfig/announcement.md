Please migrate admin UI configuration to jsonConfig

### Notification from ioBroker Check and Service Bot
Please convert existing adminUI configuration to jsonConfig.
Create and populate `admin/jsonConfig.json` and adapt `io-package.json` to specify `adminUI.config: 'json'`.
Create i18n translation files based on `words.js` using short form `admin/i18n/#language#.json` (for example `admin/i18n/de.json`).

Config data and types must not be changed. Data within `system.config...` must be kept unchanged, so no code change should be required.

If adding jsonConfig custom components is required, this is allowed but should be used only if no other possibility exists.

Existing config files (for example `index.html`, `index_m.html`) should be removed.
`words.js` should be removed if it is not used anywhere within code.
