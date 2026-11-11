[Enhancement] Consider using device-manager
### Notification from ioBroker Check and Service Bot

*Deutsche Version (Konfigurationsmanager) siehe weiter unten.*

Dear adapter developer,

Your adapter configures devices using custom tables or lists in the admin UI.

Please consider using the **Device Manager** for device configuration. The Device Manager is a standardized component that is available as a jsonConfig component and can be added as a tab to the Admin UI. Admin also supports attaching the Device Manager component to the left sidebar. This allows the Device Manager to support all current device-table functionality in a consistent, user-friendly way.

**Benefits of using Device Manager:**

- Consistent user experience across all adapters that manage devices
- Built-in support for device discovery, pairing, and removal actions
- Standardized device detail views with expandable rows
- Support for per-instance actions (e.g. "Search devices", "Pair new device") and per-device actions (e.g. "Edit settings", "Remove")
- Device controls for real-time interaction (switches, sliders, buttons, etc.)
- Maintained centrally — improvements and fixes benefit all adapters using it
- Tight integration with ioBroker Admin, including sidebar placement

**Reference adapters using Device Manager:**

- [ioBroker.shelly](https://github.com/iobroker-community-adapters/ioBroker.shelly) — full implementation with device discovery and control
- [ioBroker.lorawan](https://github.com/iobroker-community-adapters/ioBroker.lorawan) — device list with actions
- [ioBroker.matter](https://github.com/ioBroker-community-adapters/ioBroker.matter) — pairing and device management
- [ioBroker.zigbee2mqtt](https://github.com/arteck/ioBroker.zigbee2mqtt) — device list and control
- [ioBroker.tradfri](https://github.com/AlCalzone/ioBroker.tradfri) — device discovery and scenes

**Documentation and resources:**

- dm-utils library: https://github.com/ioBroker/dm-utils
- jsonConfig documentation: https://github.com/ioBroker/ioBroker.admin/tree/master/packages/jsonConfig#readme
- Reference implementation: see [ioBroker.shelly](https://github.com/iobroker-community-adapters/ioBroker.shelly) for a working example

Please contact @GermanBluefox if you have any questions or need support implementing the Device Manager.

Please close this issue once you have reviewed the Device Manager and decided how to proceed.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.  
_Let's work together for the best user experience._

your  
_ioBroker Check and Service Bot_

@mcm1957 for evidence

- - -

**Deutschsprachige Version (Konfigurationsmanager)**

Liebe Adapterentwickler,

Dieser Adapter konfiguriert Geräte über eigene Tabellen oder Listen in der Admin-Oberfläche.

Bitte prüft die Möglichkeit, hierfür den **Konfigurationsmanager** zu verwenden. Der Konfigurationsmanager ist als jsonConfig-Komponente verfügbar und kann als Tab zur Admin-Oberfläche hinzugefügt werden. Admin unterstützt auch das Einbinden der Komponente in der linken Seitenleiste. Der Konfigurationsmanager kann so die bestehende Gerätetabellen-Funktionalität auf standardisierte Weise abbilden.

**Vorteile des Konfigurationsmanagers:**

- Einheitliches Benutzererlebnis über alle Adapter hinweg, die Geräte verwalten
- Integrierte Unterstützung für Geräteerkennung, Kopplung und Entfernung
- Standardisierte Gerätedetailansichten mit aufklappbaren Zeilen
- Unterstützung für instanzbezogene Aktionen (z. B. „Geräte suchen", „Neues Gerät koppeln") und gerätebezogene Aktionen (z. B. „Einstellungen bearbeiten", „Entfernen")
- Gerätesteuerung für Echtzeit-Interaktionen (Schalter, Regler, Schaltflächen usw.)
- Zentrale Pflege — Verbesserungen und Fehlerbehebungen kommen allen Adaptern zugute
- Enge Integration mit ioBroker Admin, einschließlich Platzierung in der Seitenleiste

**Referenzadapter mit Konfigurationsmanager:**

- [ioBroker.shelly](https://github.com/iobroker-community-adapters/ioBroker.shelly) — vollständige Implementierung mit Geräteerkennung und -steuerung
- [ioBroker.lorawan](https://github.com/iobroker-community-adapters/ioBroker.lorawan) — Geräteliste mit Aktionen
- [ioBroker.matter](https://github.com/ioBroker-community-adapters/ioBroker.matter) — Kopplung und Geräteverwaltung
- [ioBroker.zigbee2mqtt](https://github.com/arteck/ioBroker.zigbee2mqtt) — Geräteliste und Steuerung
- [ioBroker.tradfri](https://github.com/AlCalzone/ioBroker.tradfri) — Geräteerkennung und Szenen

**Dokumentation und Ressourcen:**

- dm-utils Bibliothek: https://github.com/ioBroker/dm-utils
- jsonConfig Dokumentation: https://github.com/ioBroker/ioBroker.admin/tree/master/packages/jsonConfig#readme
- Referenzimplementierung: siehe [ioBroker.shelly](https://github.com/iobroker-community-adapters/ioBroker.shelly) für ein funktionierendes Beispiel

Bei Fragen oder Unterstützung bei der Implementierung bitte @GermanBluefox kontaktieren.

Bitte das Issue schließen, sobald der Konfigurationsmanager geprüft und eine Entscheidung getroffen wurde.

Bei weiteren Fragen bitte gerne melden (@iobroker-bot).

Und **VIELEN DANK** von mir und allen Benutzern für die Pflege dieses Adapters.  
_Lasst uns gemeinsam für ein optimales Benutzererlebnis sorgen._

Euer  
_ioBroker Check- und Service-Bot_
