Migration to EsLint 9 and @iobroker/eslint-config

### Notification from ioBroker Check and Service Bot

*Deutsche Version siehe weiter unten.*

Dear Adapter developer,

ESLint 9 is published since some time ago. If you use dependabot, it will create PRs to update from time to time. It looks like you are still using an older version of ESLint. This is **no** problem currently and its up to you to decide when you plan to update ESLint.

**If you plan to migrate to ESLint 9 please consider to use new standard EsLint configuration provided by ioBroker core team and located at @iobroker/eslint-config instead of a complete private configuration.**

To aid migration a migration guide has been published at https://github.com/ioBroker/ioBroker.eslint-config/blob/main/MIGRATION.md describing the step to migrate to @iobroker/eslint-config.

Please note that especially prettier might report several issues. Most of them can be fixed by using 'npm run lint -- --fix' automatically. Please give it a try. The rules published by core team are used (or at least will be used in future) be all adapters maintained by core team. So be ensured that the configuration is well reviewed.

But to make thinks clear: 
- You may adapt rules for your adapter if you feel a strong need to do so.
- You may exclude some (maybe very old) files from checking.
- The use of @iobroker/eslint-config is strongly recommended but not mandatory.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.  
_Let's work together for the best user experience._

your  
_ioBroker Check and Service Bot_


---

Sehr geehrter Adapter-Entwickler,

ESLint 9 wurde vor einiger Zeit veröffentlicht. Falls Sie Dependabot verwenden, werden von Zeit zu Zeit PRs zum Aktualisieren erstellt. Es sieht so aus, als würden Sie derzeit noch eine ältere Version von ESLint verwenden. Dies ist **kein** Problem und Sie können selbst entscheiden, wann Sie ESLint aktualisieren möchten.

**Wenn Sie auf ESLint 9 migrieren möchten, sollten Sie die neue Standardkonfiguration von EsLint verwenden, die vom ioBroker-Coreteam bereitgestellt wird und unter @iobroker/eslint-config verfügbar ist, anstatt eine komplett private Konfiguration zu erstellen.**

Zur Unterstützung der Migration wurde unter https://github.com/ioBroker/ioBroker.eslint-config/blob/main/MIGRATION.md ein Migrationsleitfaden veröffentlicht, der die Schritte zur Migration nach @iobroker/eslint-config beschreibt.

Bitte beachten Sie, dass insbesondere Prettier mehrere Probleme melden könnte. Die meisten davon können automatisch durch die Verwendung von „npm run lint -- --fix“ behoben werden. Bitte probieren Sie es aus. Die vom Core-Team veröffentlichten Regeln werden (oder werden zumindest in Zukunft) von allen Adaptern verwendet, die vom Core-Team gepflegt werden. Es ist also sichergestellt, dass diese Konfiguration gut überprüft wurde.

Aber auch Folgenses soll klargestellt werden:
- Sie können Regeln für Ihren Adapter anpassen, wenn Sie das dringend für nötig halten.
- Sie können einige (möglicherweise sehr alte) Dateien von der Überprüfung ausschließen.
- Und die Verwendung von @iobroker/eslint-config wird dringend empfohlen, ist aber nicht zwingend erforderlich.

Wenden Sie sich bei Fragen gerne an mich (@iobroker-bot).

Und **VIELEN DANK** von mir und allen Benutzern für die Pflege dieses Adapters.
_Lassen Sie uns gemeinsam für das beste Benutzererlebnis arbeiten._

Ihr
_ioBroker Check and Service Bot_