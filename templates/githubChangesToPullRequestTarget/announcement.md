[ACTION REQUIRED] GitHub changes to workflows using PULL_REQUEST_TARGET
### Notification from ioBroker Check and Service Bot

*Deutsche Version siehe weiter unten.*

Dear adapter developer,

GitHub will enforce execution policies for workflows using `pull_request_target` on **November 2, 2026**. After this date, workflows triggered by pull requests from forked repositories will no longer be started using `pull_request_target` unless this event is explicitly allowed by an execution policy.

See the official documentation: https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target#default-policy-for-pull_request_target

GitHub is currently informing about this change using an annotation in the workflow log for affected workflows:
> Workflow execution policy warning (evaluate mode): .github/workflows/automerge-iobroker-bot.yml#L1  
> On November 2, 2026, GitHub will restrict `pull_request_target` on public repositories by default. To continue allowing the event trigger, configure an Actions policy. Learn more: https://gh.io/securely-using-pull_request_target#default-policy-for-pull_request_target

If you must use `pull_request_target` after this date, you must add an explicit policy.

**Before re-enabling `pull_request_target`, ensure that you meet all security requirements.**  
Workflows using `pull_request_target` execute in the context of the target repository. If the workflow accesses modified data provided by the pull request, a PR creator could execute malicious code affecting your repository. Extraction of private access tokens would also be possible.

Replacing `pull_request_target` with `pull_request` is safe, but not appropriate in all cases. Workflows triggered by `pull_request` receive a `GITHUB_TOKEN` restricted to read access. In addition, secrets are never passed to such a workflow. So those workflows cannot write to your repository or the PR, cannot perform merges, and cannot add comments or attach/modify labels.

**There is one important exception:**  
PRs created by Dependabot are handled with additional privileges. PRs created by Dependabot trigger workflows using `pull_request` **with write access enabled**. So automerging for Dependabot PRs is still possible using `pull_request`.

If you are using the standard ioBroker workflow `automerge-dependabot.yml`, you will receive a PR with a modified version using `pull_request`. This workflow should continue to work after merging the PR.

If you have custom workflows depending on `pull_request_target`, check whether they can be modified to avoid `pull_request_target`, or verify that they are truly secure before adding an explicit policy.

Please close the issue once you have reviewed and addressed your workflows.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.  
_Let's work together for the best user experience._

your  
_ioBroker Check and Service Bot_

@mcm1957 for evidence

- - -

**Deutschsprachige Version**

Liebe Adapterentwickler,

GitHub wird ab dem **2. November 2026** Ausführungsrichtlinien für Workflows erzwingen, die `pull_request_target` verwenden. Nach diesem Datum werden Workflows, die durch Pull Requests aus geforkten Repositories ausgelöst werden, nicht mehr über `pull_request_target` gestartet, es sei denn, dieses Ereignis wurde durch eine explizite Ausführungsrichtlinie erlaubt.

Weitere Informationen finden sich in der offiziellen Dokumentation: https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target#default-policy-for-pull_request_target

GitHub informiert derzeit über diese Änderung durch eine Anmerkung im Workflow-Log betroffener Workflows:
> Workflow execution policy warning (evaluate mode): .github/workflows/automerge-iobroker-bot.yml#L1  
> On November 2, 2026, GitHub will restrict `pull_request_target` on public repositories by default. To continue allowing the event trigger, configure an Actions policy. Learn more: https://gh.io/securely-using-pull_request_target#default-policy-for-pull_request_target

Falls `pull_request_target` nach diesem Datum weiterhin benötigt wird, muss eine explizite Richtlinie hinzugefügt werden.

**Bevor `pull_request_target` wieder aktiviert wird, müssen alle sicherheitsrelevanten Maßnahmen geprüft werden.**  
Workflows, die `pull_request_target` verwenden, werden im Kontext des Ziel-Repositories ausgeführt. Falls der Workflow auf die vom Pull Request geänderten Daten zugreift, könnte ein PR-Ersteller schädlichen Code ausführen, der das Repository beeinflusst. Auch das Auslesen privater Zugriffstoken wäre möglich.

Das Ersetzen von `pull_request_target` durch `pull_request` ist sicher, aber nicht in allen Fällen geeignet. Workflows, die durch `pull_request` ausgelöst werden, erhalten ein `GITHUB_TOKEN` mit nur Lesezugriff. Außerdem werden Secrets niemals an solche Workflows weitergegeben. Diese Workflows können daher nicht in das Repository oder den PR schreiben, keine Merges durchführen und keine Kommentare hinzufügen oder Labels hinzufügen/ändern.

**Es gibt eine wichtige Ausnahme:**  
PRs, die von Dependabot erstellt werden, werden mit zusätzlichen Berechtigungen behandelt. Dependabot-PRs lösen Workflows über `pull_request` **mit aktiviertem Schreibzugriff** aus. Das automatische Mergen von Dependabot-PRs ist also weiterhin über `pull_request` möglich.

Wer den Standard-ioBroker-Workflow `automerge-dependabot.yml` verwendet, wird einen PR mit einer angepassten Version erhalten, die `pull_request` nutzt. Dieser Workflow sollte nach dem Mergen des PRs weiterhin funktionieren.

Für eigene Workflows, die von `pull_request_target` abhängen, sollte geprüft werden, ob sie so angepasst werden können, dass `pull_request_target` nicht mehr benötigt wird – oder es muss sichergestellt sein, dass sie wirklich sicher sind, bevor eine explizite Richtlinie hinzugefügt wird.

Bitte das Issue schließen, sobald die Workflows überprüft und entsprechend angepasst wurden.

Bei Fragen bitte gerne melden (@iobroker-bot).

Und **VIELEN DANK** von mir und allen Benutzern für die Pflege dieses Adapters.  
_Lasst uns gemeinsam für ein optimales Benutzererlebnis sorgen._

Euer  
_ioBroker Check- und Service-Bot_
