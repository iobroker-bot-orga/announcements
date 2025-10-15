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

## Actions needed for migration to "trusted publishing"

### Setup npm trust relationship (independent of test-and-release workflow variant)

### Actions for repositories using up-to-date test-and-release workflow using iobroker/action-testing-deploy

### Actions for repositories using private, modified or outdated test-and-release.yml workflow

## Upcoming PR for repositories using standard test-and.release.yml workflow
