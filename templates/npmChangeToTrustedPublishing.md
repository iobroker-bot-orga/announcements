NPM is revoking classic tokens - Migration to Trusted Publishing recommended until early November 2025

[German description can be found below](#deutsche-beschreibung)  
[Deutsche Beschreibung weiter unten](#deutsche-beschreibung)

# NPM is revoking classic tokens

## What will happen in the very near future?

NPM is currently changing several security related parameters. You might have already received a mail from npm stating the following facts:

>Dear iobroker-bot,
>  
>Important security changes are coming to npm that may affect your packages and workflows. This is the first phase of our comprehensive security improvements.
>  
>**Phase 1 changes:**  
>  • October 13: New granular tokens limited to 90-day maximum lifetime (7-day default)  
>  • October 13: New TOTP 2FA configurations disabled (existing TOTP still works)  
>  • Early November: All classic tokens will be permanently revoked
>  
>**Action required:**  
>If you use classic tokens in any automation, CI/CD pipelines, or local development, you must migrate to granular access tokens before early November to avoid publishing disruptions.
>  
>**More changes ahead:**  
>This is the first of several security updates. Additional phases will follow in the coming months, including further 2FA improvements and expanded trusted publisher support. We'll communicate each phase in advance.
>  
>**Why we're making these changes:**  
>Recent supply chain attacks have shown that compromised long-lived tokens are a critical vulnerability. These phased changes are essential to protect the npm ecosystem and your packages from malicious actors.
>  
>**Get full details and migration guidance:** https://gh.io/npm-token-changes
>  
>**Need help?**  
>  • Join the discussion: https://github.com/orgs/community/discussions/174507  
>  • Contact support: https://www.npmjs.com/support  
>  
>We understand these changes require effort from you. Thank you for your partnership in making npm more secure for millions of developers worldwide.

## Migration to Trusted Publishing recommended until early November 2025

The most important part for now stated within the mail is:  
**Early November: All classic tokens will be permanently revoked**

Without classic and permanently valid tokens, automatic deployment using the standard workflow test-and-release.yml will no longer work. 
Migration to 'Trusted Publishing' is therefore recommended and the good news is that this is already supported by ioBroker tools.

## Actions needed for migration to "Trusted Publishing"

### Setup npm trust relationship (independent of test-and-release workflow variant)

To initiate the migration to Trusted Publishing, you need to configure it in your NPM account. Follow these steps:

1. **Log in to npmjs.com** with an account that has publish rights for your package

2. **Navigate to your package page**:
   - Go to https://www.npmjs.com/package/YOUR-PACKAGE-NAME
   - Click on the "Settings" tab

3. **Configure Trusted Publishing**:
   - Scroll down to the "Publishing access" section
   - Click on "Automate publishing with GitHub Actions" or "Add trusted publisher"
   - Fill in the required information:
     - **Repository owner**: Your GitHub username or organization (e.g., `ioBroker`)
     - **Repository name**: Your adapter repository name (e.g., `ioBroker.your-adapter`)
     - **Workflow name**: `test-and-release.yml` (or the name of your release workflow)
     - **Environment**: Leave blank

4. **Save the configuration**

For more information, see:
- [NPM Trusted Publishing documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

### Actions for repositories using up-to-date test-and-release workflow using iobroker/action-testing-deploy

You must adapt your workflow file test-and-release.yml.

1. **Open test-and-release.yml to edit this file either directly at github.com or at your development environment**
   
2. **Remove npm-token from deploy section**
   - locate job named 'deploy'. It should look like
  
     ```
       # Deploys the final package to NPM
      deploy:
        needs: [check-and-lint, adapter-tests]
    
        # Trigger this step only when a commit on any branch is tagged with a version number
        if: |
          contains(github.event.head_commit.message, '[skip ci]') == false &&
          github.event_name == 'push' &&
          startsWith(github.ref, 'refs/tags/v')
    
        runs-on: ubuntu-latest
    
        # Write permissions are required to create Github releases
        permissions:
          contents: write
    
        steps:
          - uses: ioBroker/testing-action-deploy@v1
            with:
              node-version: '20.x'
              # Uncomment the following line if your adapter cannot be installed using 'npm ci'
              # install-command: 'npm install'
              build: true
              npm-token: ${{ secrets.NPM_TOKEN }}
              github-token: ${{ secrets.GITHUB_TOKEN }}
      ```

      - locate line starting with 'npm-token:'
      - remove this line (or comment it out by adding a '#' as first char)
      - locate block starting with 'permissions:'
      - add a line 'id-token: write'.
        Take care of correct indentation to avoid creating an invalid yaml file.
        If the block is missing altogether please add it including 'contents: write' line as shown in example.

  3. **Test release and deploy workflow**
     Test functionality by creating a test release.
     
  4. **Remove the NPM_TOKEN secret** from your GitHub repository settings (optional, after confirming everything works)

### Actions for repositories using private, modified or outdated test-and-release.yml workflow

If your repository is not yet using the standard test-and-release workflow the following steps are recommended:

- Evaluate to use standard test-and-release workflow and process as described previously.
- If you must keep a modified / private test-and-release workflow consider at least using action ioBroker/testing-action-deploy@v1 within your workflow. You can then follow the migration guide described previously
- If you really must use a private deploy mechanism follow the steps described at [NPM Trusted Publishing documentation](https://docs.npmjs.com/generating-provenance-statements). The following points are important:
  - ensure that you entered the correct workflow name when setting up 'Trusted Publishing'
  - ensure that you really use the newest npm release to process the deploy. Use a dedicated 'npm install -g npm@latest' command for update within your workflow. npm packaged within your node release might be too old. Add the npm upgrade near the deploy command - do not update npm for the complete workflow as this might cause negative side effects.
  - do NOT use a token or try to login to npm. Use the 'npm publish' without dedicated authorization. 

## Upcoming PR for repositories using standard test-and-release.yml workflow

A tool to generate a PR adding the required changes to the **standard test-and-release workflow** is under development. So you might wait some more days to receive a PR proposing the required changes to test-and-release.yml. Note that you will **not** receive a PR if you are not using the default / standard workflow. The PR is expected within the next week. 

If you have any questions please contact us - best at our development channels at Telegram / Github (invites available at https://www.iobroker.dev) or by dropping a comment and mentioning me (@mcm1957).

**THANKS A LOT** for maintaining this adapter from me and all users.
*Let's work together for the best user experience.*

*your*
*ioBroker Check and Service Bot*

---

## Deutsche Beschreibung

# NPM widerruft klassische Token

## Was wird in naher Zukunft geschehen?

NPM ändert derzeit mehrere sicherheitsrelevante Parameter. Möglicherweise wurde bereits eine E-Mail von npm mit folgenden Informationen erhalten:

>Dear iobroker-bot,
>  
>Important security changes are coming to npm that may affect your packages and workflows. This is the first phase of our comprehensive security improvements.
>  
>**Phase 1 changes:**  
>• October 13: New granular tokens limited to 90-day maximum lifetime (7-day default)  
>• October 13: New TOTP 2FA configurations disabled (existing TOTP still works)  
>• Early November: All classic tokens will be permanently revoked  
>  
>**Action required:**  
>If you use classic tokens in any automation, CI/CD pipelines, or local development, you must migrate to granular access tokens before early November to avoid publishing disruptions.
>  
>**More changes ahead:**  
>This is the first of several security updates. Additional phases will follow in the coming months, including further 2FA improvements and expanded trusted publisher support. We'll communicate each phase in advance.
>  
>**Why we're making these changes:**  
>Recent supply chain attacks have shown that compromised long-lived tokens are a critical vulnerability. These phased changes are essential to protect the npm ecosystem and your packages from malicious actors.
>  
>**Get full details and migration guidance:** https://gh.io/npm-token-changes
>  
>**Need help?**  
>• Join the discussion: https://github.com/orgs/community/discussions/174507  
>• Contact support: https://www.npmjs.com/support  
>  
>We understand these changes require effort from you. Thank you for your partnership in making npm more secure for millions of developers worldwide.

## Migration zu Trusted Publishing bis Anfang November 2025 empfohlen

Der wichtigste Teil der E-Mail lautet:  
**Anfang November: Alle klassischen Token werden dauerhaft widerrufen**

Ohne klassische und dauerhaft gültige Token funktioniert die automatische Bereitstellung mit dem Standard-Workflow test-and-release.yml nicht mehr. 
Die Migration zu 'Trusted Publishing' wird daher empfohlen, und die gute Nachricht ist, dass dies bereits von ioBroker-Tools unterstützt wird.

## Erforderliche Aktionen für die Migration zu "Trusted Publishing"

### Einrichtung der npm-Vertrauensbeziehung (unabhängig von der test-and-release Workflow-Variante)

Um die Migration zu Trusted Publishing zu initiieren, muss dies im NPM-Konto konfiguriert werden. Folgende Schritte sind dazu erforderlich:

1. **Bei npmjs.com anmelden** mit einem Konto, das Veröffentlichungsrechte für das Paket besitzt

2. **Zur Paketseite navigieren**:
   - Zu https://www.npmjs.com/package/YOUR-PACKAGE-NAME gehen
   - Auf den Tab "Settings" klicken

3. **Trusted Publishing konfigurieren**:
   - Nach unten zum Abschnitt "Publishing access" scrollen
   - Auf "Automate publishing with GitHub Actions" oder "Add trusted publisher" klicken
   - Die erforderlichen Informationen ausfüllen:
     - **Repository owner**: GitHub-Benutzername oder Organisation (z.B. `ioBroker`)
     - **Repository name**: Name des Adapter-Repositories (z.B. `ioBroker.your-adapter`)
     - **Workflow name**: `test-and-release.yml` (oder der Name des Release-Workflows)
     - **Environment**: Leer lassen

4. **Konfiguration speichern**

Weitere Informationen sind verfügbar unter:
- [NPM Trusted Publishing Dokumentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC Dokumentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

### Aktionen für Repositories mit aktuellem test-and-release Workflow unter Verwendung von iobroker/action-testing-deploy

Die Workflow-Datei test-and-release.yml muss angepasst werden.

1. **test-and-release.yml zur Bearbeitung öffnen, entweder direkt bei github.com oder in der lokalen Entwicklungsumgebung**
   
2. **npm-token aus dem deploy-Abschnitt entfernen**
   - Den Job namens 'deploy' suchen. Er sollte wie folgt aussehen:
  
     ```
       # Deploys the final package to NPM
      deploy:
        needs: [check-and-lint, adapter-tests]
    
        # Trigger this step only when a commit on any branch is tagged with a version number
        if: |
          contains(github.event.head_commit.message, '[skip ci]') == false &&
          github.event_name == 'push' &&
          startsWith(github.ref, 'refs/tags/v')
    
        runs-on: ubuntu-latest
    
        # Write permissions are required to create Github releases
        permissions:
          contents: write
    
        steps:
          - uses: ioBroker/testing-action-deploy@v1
            with:
              node-version: '20.x'
              # Uncomment the following line if your adapter cannot be installed using 'npm ci'
              # install-command: 'npm install'
              build: true
              npm-token: ${{ secrets.NPM_TOKEN }}
              github-token: ${{ secrets.GITHUB_TOKEN }}
      ```

      - Die Zeile, die mit 'npm-token:' beginnt, suchen
      - Diese Zeile entfernen (oder auskommentieren, indem ein '#' als erstes Zeichen hinzugefügt wird)
      - Den Block, der mit 'permissions:' beginnt, suchen
      - Eine Zeile 'id-token: write' hinzufügen.
        Auf korrekte Einrückung achten, um eine ungültige YAML-Datei zu vermeiden.
        Falls der Block vollständig fehlt, diesen einschließlich der Zeile 'contents: write' wie im Beispiel gezeigt hinzufügen.

  3. **Release- und Deploy-Workflow testen**
     Die Funktionalität durch Erstellen eines Test-Releases testen.
     
  4. **Das NPM_TOKEN Secret entfernen** aus den GitHub-Repository-Einstellungen (optional, nachdem bestätigt wurde, dass alles funktioniert)

### Aktionen für Repositories mit privaten, modifizierten oder veralteten test-and-release.yml Workflows

Falls das Repository noch nicht den Standard-test-and-release Workflow verwendet, werden folgende Schritte empfohlen:

- Prüfen, ob der Standard-test-and-release Workflow und der zuvor beschriebene Prozess verwendet werden können.
- Falls ein modifizierter / privater test-and-release Workflow beibehalten werden muss, zumindest die Verwendung der Action ioBroker/testing-action-deploy@v1 innerhalb des Workflows in Betracht ziehen. Dann kann dem zuvor beschriebenen Migrationsleitfaden gefolgt werden.
- Falls wirklich ein privater Deploy-Mechanismus verwendet werden muss, den Schritten in der [NPM Trusted Publishing Dokumentation](https://docs.npmjs.com/generating-provenance-statements) folgen. Folgende Punkte sind dabei wichtig:
  - Sicherstellen, dass der korrekte Workflow-Name beim Einrichten von 'Trusted Publishing' eingegeben wurde
  - Sicherstellen, dass wirklich die neueste npm-Version für den Deploy-Prozess verwendet wird. Einen dedizierten 'npm install -g npm@latest' Befehl für das Update innerhalb des Workflows verwenden. Die mit der Node-Version gepackte npm-Version könnte zu alt sein. Das npm-Upgrade in der Nähe des Deploy-Befehls hinzufügen - npm nicht für den gesamten Workflow aktualisieren, da dies negative Nebeneffekte verursachen könnte.
  - KEINEN Token verwenden und NICHT versuchen, sich bei npm anzumelden. 'npm publish' ohne dedizierte Autorisierung verwenden.

## Anstehender PR für Repositories mit Standard-test-and-release.yml Workflow

Ein Tool zur Generierung eines PRs, das die erforderlichen Änderungen zum **Standard-test-and-release Workflow** hinzufügt, befindet sich in der Entwicklung. Es kann also noch einige Tage gewartet werden, um einen PR mit den erforderlichen Änderungen an test-and-release.yml zu erhalten. Zu beachten ist, dass **kein** PR empfangen wird, falls nicht der Standard-Workflow verwendet wird. Der PR wird innerhalb der nächsten Woche erwartet.

Bei Fragen bitte Kontakt aufnehmen - am besten über die Entwicklungskanäle bei Telegram / Github (Einladungen verfügbar unter https://www.iobroker.dev) oder durch Hinterlassen eines Kommentars und Erwähnen von @mcm1957.

**VIELEN DANK** für die Pflege dieses Adapters von mir und allen Benutzern.
*Gemeinsam für die beste Benutzererfahrung arbeiten.*

*Euer*
*ioBroker Check and Service Bot*
