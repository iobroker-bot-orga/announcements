ALARM Potential security Alarm by compromised release of one or more npm packages detected ALARM
Notification from ioBroker Check and Service Bot
Deutsche Version weiter unten

Dear Adapter developer,

Our repository check found indicators that your project may have been affected by the recent supply chain attack involving compromised npm packages. This can happen, for example, if a malicious `router_init.js` file exists in the repository, if `@tanstack/setup` or a `github:tanstack/router` dependency reference is present, or if one of the compromised `@tanstack/*` package versions is referenced in `package.json` or `package-lock.json`.

Please check your repository immediately and rotate your GitHub token and, if it is still in use, your npm token. Please also verify carefully that no malicious code has been committed to the repository or published to npm.

Details about the supply chain attack can be found at:

https://www.golem.de/news/supply-chain-angriff-hunderte-von-npm-und-pypi-paketen-kompromittiert-2605-208562.html

https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack

Support is also available in our forum:
https://forum.iobroker.net/topic/84537/hunderte-von-npm-und-pypi-paketen-kompromittiert

If you installed affected dependencies, please review the affected environment, reinstall dependencies from clean versions only, and check whether any credentials or secrets may have been exposed.

Feel free to contact me (@iobroker-bot) if you have any questions.

your  
_ioBroker Check and Service Bot_

---

Benachrichtigung vom ioBroker Check- und Service-Bot
Deutsche Version

Lieber Adapter-Entwickler,

unsere Repository-Prüfung hat Hinweise gefunden, dass dein Projekt von dem aktuellen Supply-Chain-Angriff mit kompromittierten npm-Paketen betroffen sein könnte. Das kann zum Beispiel der Fall sein, wenn sich eine schädliche Datei `router_init.js` im Repository befindet, wenn `@tanstack/setup` oder eine Abhängigkeit mit `github:tanstack/router` referenziert wird oder wenn eine der kompromittierten `@tanstack/*`-Versionen in `package.json` oder `package-lock.json` eingetragen ist.

Bitte überprüfe dein Repository sofort und rotiere deinen GitHub-Token sowie, falls noch verwendet, auch deinen npm-Token. Prüfe außerdem sorgfältig, ob schädlicher Code in das Repository committet oder bei npm veröffentlicht wurde.

Details zu dem Supply-Chain-Angriff findest du hier:

https://www.golem.de/news/supply-chain-angriff-hunderte-von-npm-und-pypi-paketen-kompromittiert-2605-208562.html

https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack

Unterstützung gibt es auch in unserem Forum:
https://forum.iobroker.net/topic/84537/hunderte-von-npm-und-pypi-paketen-kompromittiert

Falls betroffene Abhängigkeiten installiert wurden, überprüfe bitte auch die betroffene Umgebung, installiere Abhängigkeiten nur aus sauberen Versionen neu und kontrolliere, ob Zugangsdaten oder andere Geheimnisse offengelegt wurden.

Wenn du Fragen hast, melde dich gerne bei mir (@iobroker-bot).

dein  
_ioBroker Check and Service Bot_
