//
// Select all adapters which have at least one workflow in .github/workflows/*.yml
// that uses pull_request_target as a triggering event.
//

'use strict';

const axios = require('axios');

async function init(context) {
    context.report = [];

    const response = await axios.get('https://www.iobroker.net/data/statistics.json');
    const statistics = response.data;
    const adapters = statistics.adapters;

    let adapterArray = [];
    for (const [adapter, count] of Object.entries(adapters)) {
        const entry = `${count.toString().padStart(10, '0')}:${adapter}`;
        adapterArray.push(entry);
    }
    adapterArray = adapterArray.sort().reverse();

    const adapterInfo = {};
    let rank = 1;
    for (const entry of adapterArray) {
        const user = entry.split(':')[0];
        const adapter = entry.split(':')[1];
        adapterInfo[adapter] = {};
        adapterInfo[adapter].user = +user;
        adapterInfo[adapter].rank = rank;
        rank = rank + 1;
    }
    context.adapterInfo = adapterInfo;
}

async function getWorkflowFiles(githubApiUrl, branch) {
    try {
        const response = await axios.get(`${githubApiUrl}/contents/.github/workflows?ref=${encodeURIComponent(branch)}`);
        const entries = response.data;
        if (!Array.isArray(entries)) {
            console.log(`[INFO] .github/workflows/ is not a directory`);
            return [];
        }
        return entries
            .filter(entry => entry.type === 'file' && /\.ya?ml$/i.test(entry.name))
            .map(entry => entry.name)
            .sort();
    } catch (e) {
        console.log(`[INFO] cannot list .github/workflows/ - skipping`);
        return [];
    }
}

async function test(context) {
    if (context.owner.toLowerCase() === 'iobroker-community-adapters') {
        console.log(`[INFO] skipping ${context.owner}/ioBroker.${context.adapter} (owned by iobroker-community-adapters)`);
        return false;
    }

    const repoUrl = `https://github.com/${context.owner}/ioBroker.${context.adapter}`;
    const githubApiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');

    let githubApiData;
    try {
        const response = await axios.get(githubApiUrl, { cache: false });
        githubApiData = response.data;
    } catch (e) {
        console.log(`[ERROR] cannot access GitHub API for ${repoUrl}: ${e}`);
        return false;
    }

    const branch = githubApiData.default_branch;
    const rawBaseUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${branch}`;

    const workflowFiles = await getWorkflowFiles(githubApiUrl, branch);
    if (!workflowFiles.length) {
        console.log(`[INFO] no workflow files found in .github/workflows/ - skipping`);
        return false;
    }

    for (const fileName of workflowFiles) {
        let content;
        try {
            const response = await axios.get(`${rawBaseUrl}/.github/workflows/${fileName}`);
            content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        } catch (e) {
            console.log(`[INFO] cannot download .github/workflows/${fileName} - ignoring`);
            continue;
        }

        if (/pull_request_target/i.test(content)) {
            console.log(`[INFO] .github/workflows/${fileName} contains pull_request_target - triggering notification`);
            const reportStart = `- [ ] ${context.owner}/ioBroker.${context.adapter}  - ${context.adapterInfo[context.adapter]?.user} user / rank ${context.adapterInfo[context.adapter]?.rank}`;
            context.report.push(reportStart);
            return true;
        }
    }

    console.log(`[INFO] no workflow file contains pull_request_target - skipping`);
    return false;
}

async function finalize(context) {
    console.log(context.report.sort().join('\n'));
    console.log(`\ncreated by template ${context.template}`);
}

exports.init = init;
exports.test = test;
exports.finalize = finalize;
