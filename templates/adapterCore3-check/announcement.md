IMPORTANT: Update of dependency @iobroker/adapter-core is required as soon as possible
### Notification from ioBroker Check and Service Bot
(Deutscher Text siehe weiter unten)

Dear Adapter developer,

Your adapter has a dependency to `@iobroker/adapter-core` less than 3.x.x.

Current js-controller versions (up to js-controller 7.0.0) have a built in workaround so that your adapter still works. This workaround will be removed with next major update of js-controller to avoid other issues and allow further development of js-controller and other components.

**Please update the dependency of @iobroker/adapter-core to the current version (3.2.2) as soon as possible.**

If your adapter is not updated it will stop working at systems running js-controller > 7.0.x. So please update your adapter and release a new version as soon as your time allows. Normally updating the dependency of @iobroker/adapter-core should not require any code changes and should not cause problems if your adapter is working with current js-controller releases 6 or 7.

Please close this issue after you updated the dependency and released a new version.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.  
_Let's work together for the best user experience._

your
_ioBroker Check and Service Bot_

---

Lieber Entwickler,

Dieser Adapter spezifiziert derzeit eine Abhängigkeit von `@iobroker/adapter-core` kleiner als 3.x.x.

Aktuelle js-controller-Versionen (bis js-controller 7.0.0) haben einen integrierten Workaround, damit der Adapter weiterhin funktioniert. Dieser Workaround wird mit dem nächsten größeren Update des js-controllers entfernt, um andere Probleme zu vermeiden und die Weiterentwicklung von js-controller und anderen Komponenten zu ermöglichen.

**Bitte daher die Abhängigkeit von @iobroker/adapter-core so schnell wie möglich auf die aktuelle Version (3.2.2) aktualisieren.**

Wird der Adapter nicht aktualisiert, funktioniert er auf Systemen mit js-controller > 7.0.x nicht mehr. Bitte daher den Adapter aktualisieren und eine neue Version veröffentlichen. Normalerweise sollte das Aktualisieren der Abhängigkeit von @iobroker/adapter-core keine Codeänderungen erfordern und auch keine Probleme auslösen sofern der Adapter derzeit mit js-controller 6 oder 7 funktioniert.

Bitte das Issue schließen, nachdem die Abhängigkeit aktualisiert und eine neue Version veröffentlicht wurde.

Bei Fragen zur Aktualisierung können Sie mich gerne kontaktieren (@iobroker-bot).

Und **VIELEN DANK** von mir und allen Benutzern für die Wartung dieses Adapters.  
_Lassen Sie uns gemeinsam für das beste Benutzererlebnis arbeiten._

Ihr
_ioBroker Check- und Service-Bot_

@mcm1957 for evidence
