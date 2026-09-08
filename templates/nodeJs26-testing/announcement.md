Compatibility check and testing for node.js 26
### Notification from ioBroker Check and Service Bot

Dear Adapter developer,

Node.js 26 will become the official node.js LTS release October 2026- see [node-releases](https://github.com/nodejs/release#nodejs-release-working-group)

**So please check your adapter with Node.js 26.**

Please add node.js 26 to the adapter testing matrix which is executed on commits. This check is normally controlled by workflow located at .github/workflows/test-and-release.yml. The recommended testmatrix is [22.x, 24.x, 26.x] now. It's ok to test node.js 22.x and 24.x only if there are any technical reasons (i.e. requirements caused by dependencies) to do so.

In any case please set the 'engines' clause in package.json according to the minimum node version used at testing. Please also do this if the adapter is not able to work with certain Node.js versions, so that ioBroker can prevent users from installing the adapter if not compatible. If you detect any incompatibility with node.js 26 please try to fix it and / or let us know if the problem seems to be located at core components.

Please close the issue after you checked it.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.
_Let's work together for the best user experience._

your
_ioBroker Check and Service Bot_

@mcm1957 for evidence
24
_Note: If you added node 26 tests already, simply close this issue._

- - - 

**Deutschsprachige Version**

Liebe Adapterentwickler,

Node.js 26 wird im Oktober 2026 die offizielle Node.js LTS-Version – siehe [node-releases](https://github.com/nodejs/release#nodejs-release-working-group)

**Bitte überprüfen Sie Ihren Adapter mit Node.js 26.**

Bitte Node.js 26 zur Adapter-Testmatrix, die bei Commits ausgeführt wird, hinzufügen. Diese Prüfung wird normalerweise durch einen Workflow unter .github/workflows/test-and-release.yml gesteuert. Die empfohlene Testmatrix ist derzeit  [22.x, 24.x, 26.x]. Die Tests können auf Node.js 22.x und 24.x beschränkt werden, wenn technische Gründe (z. B. Anforderungen aufgrund von Abhängigkeiten) dafür vorliegen.

Bitte auch die engines-Anforderung in package.json in jedem Fall entsprechend der beim Test verwendeten Mindest-Node-Version anpassen. Dies gilt auch, wenn der Adapter mit bestimmten Node.js-Versionen nicht kompatibel ist. So kann ioBroker Benutzer daran hindern, den Adapter zu installieren, falls er nicht kompatibel ist. Sollten Inkompatibilitäten mit Node.js 26 festgestellt werden, bitte versuchen diese zu beheben und/oder uns mitzuteilen falls das Problem bei den Kernkomponenten vermutet wird.

Bitte dieses Issue nach der Überprüfung schließen.

Bei Fragen können Sie mich gerne kontaktieren (@iobroker-bot).

Und **VIELEN DANK** von mir und allen Benutzern für die Pflege dieses Adapters.
_Lasst uns gemeinsam für ein optimales Benutzererlebnis sorgen._

Ihr
_ioBroker Check- und Service-Bot_

_Hinweis: Falls Node.js 26-Tests bereits hinzugefügt wurden, Issue einfach schließen._
