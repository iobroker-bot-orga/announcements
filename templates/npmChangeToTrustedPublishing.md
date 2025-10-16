NPM is is revoking classic tokens - Migration to trusted Publishing recommended until early Noverber 2025

# NPM is is revoking classic tokens

## What will happen in the very near future?

NPM is currently changing several security related parameters. You might already received a mail from npm sating the following facts:

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

## Migration to trusted Publishing recommended until early November 2025

The most import part for now stated within the mail is:  
**Early November: All classic tokens will be permanently revoked**

Withoud (classic) and permanently valid tokens automatic deploy using the standard workflow test-and-release.yml will no longer work. 
Migration to 'trusted publishing' is recommended therefore and the good news is that this already supported by ioBroker tools.

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

You must adapt your workflow file test-and.release.yml.

1. **Open test-and.release.yml to edit this file either directly at github.com or at your developmen environment
   
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
      - remove this line (or comment it out by setting adding a '#' as first char
      - locate block starting with 'permissions:'
      - add a line 'id-token: write'.
        Take care of correct indentation to avoid creating an invalid yaml file.
        If the block is missing all together please add it including 'write: true' line as shown in example.

  3. **Test release and deploy workflow**
     Test functionality by creating atest release.
     
  4. **Remove the NPM_TOKEN secret** from your GitHub repository settings (optional, after confirming everything works)

### Actions for repositories using private, modified or outdated test-and-release.yml workflow

If your repository is not yet using the standard test-and-release workflow the following steps are recommended:

- Evaluate to use standard test-and-release workflow and process as described previously.
- If you must keep a modified / proivate test-and release workflow consider at least using action ioBroker/testing-action-deploy@v1 within your workflow. You can then follow the migration guide described previously
- If you really must use a private deploy mechanism follow the steps describe at [NPM Trusted Publishing documentation](https://docs.npmjs.com/generating-provenance-statements). The following points are important:
  - ensure that you entred the correct workflow name when setting up 'Trusted Publishing'
  - ensure that you really use the newest npm release to process the deploy. Use a dedicated 'npm install -g npm@latest' command for update within your workflow. npm packaged within your node release might be too old. Add the npm upgrade near the deploy command - do not update nom for the complete workflow as this might cause negative sideeffects.
  - do NOT use a token or try to login to npm. Use the 'npm deploy' withou dedicated authorization. 

## Upcoming PR for repositories using standard test-and.release.yml workflow

A tool to generate a PR adding the reuired changes to the **standard test-and-release workflow** is under development. So you might wait some more days to receive a PR proposing the required changes to test-and-release.xml. Note that you will **not** receive a PR if you are not using the default / standard workflow. The PR is expected within the next week. 

If you have any questions please contact us - best at our development channels at Telegramm / Github (invites available at https://www.iobroker.dev) or by dropping a commend an mentioning me (@mcm1957).

**THANKS A LOT** for maintaining this adapter from me and all users.
*Let's work together for the best user experience.*

*your*
*ioBroker Check and Service Bot*
