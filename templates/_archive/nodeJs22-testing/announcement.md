Compatibility check and testing for node.js 22
### Notification from ioBroker Check and Service Bot

Dear Adapter developer,

Node.js 22 will become the official node.js LTS release October 2024 - see [node-releases](https://github.com/nodejs/release#nodejs-release-working-group)

**So please check your adapter with Node.js 22.**

Please add node.js 22 to the adapter testing matrix which is executed on commits. This check is normally controlled by workflow located at .github/workflows/test-and-release.yml. The recommended testmatrix is [18.x, 20.x, 22.x] now. It's ok to test node.js 20.x and 22.x only if there are any technical reasons (i.e. requirements caused by dependencies) to do so.

In any case please set the 'engines' clause in package.json according to the minimum node version used at testing. Please also do this if the adapter is not able to work with certain Node.js versions, so that ioBroker can prevent users from installing the adapter if not compatible. If you detect any incompatibility with node.js 22 please try to fix it and / or let us know if the problem seems to be located at core components.

Please close the issue after you checked it.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.
_Let's work together for the best user experience._

your
_ioBroker Check and Service Bot_

@mcm1957 for evidence

_Note: If you added node 22 tests already, simply close this issue._