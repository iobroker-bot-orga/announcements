//
// select all adapters which
// - specify common.adminUI.config === 'json' in io-package.json and
// - have at least one admin/*.json or admin/*.json5 file containing a jsonConfig element of type 'custom'
//

'use strict';

const axios = require('axios');

async function downloadFile(githubUrl, path) {
    console.log(`[INFO] download ${githubUrl}${path || ''}`);

    const options = {};
    try {
        const response = await axios(githubUrl + (path || ''), options);
        return(response.data);
    } catch (e) {
        console.log(`[ERROR] cannot download ${githubUrl}${path || ''} ${e}`);
        throw e;
    }
}

async function getAdminJsonFiles(githubApiUrl, branch) {
    let entries;
    try {
        const response = await axios.get(`${githubApiUrl}/contents/admin?ref=${encodeURIComponent(branch)}`);
        entries = response.data;
    } catch (e) {
        console.log(`[INFO] cannot list directory admin/ ${e}`);
        return [];
    }

    if (!Array.isArray(entries)) {
        console.log(`[INFO] admin/ is not a directory`);
        return [];
    }

    return entries
        .filter(entry => entry.type === 'file' && /\.json5?$/i.test(entry.name))
        .map(entry => entry.name)
        .sort();
}

async function init(context){
    context.report = [];

    const response = await axios.get('https://www.iobroker.net/data/statistics.json');
    const statistics = response.data;
    const adapters = statistics.adapters;

    let adapterArray=[];
    for (const [adapter, count] of Object.entries(adapters)) {
        const entry = `${count.toString().padStart(10,'0')}:${adapter}`;
        adapterArray.push(entry);
    }
    adapterArray=adapterArray.sort().reverse();

    const adapterInfo = {};
    let rank = 1;
    for (const entry of adapterArray) {
        const user = entry.split(':')[0];
        const adapter = entry.split(':')[1];
        adapterInfo[adapter] = {};
        adapterInfo[adapter].user = +user;
        adapterInfo[adapter].rank = rank;
        rank=rank+1;
    }
    context.adapterInfo=adapterInfo;
}

async function test(context){

    const repoUrl =  `https://github.com/${context.owner}/ioBroker.${context.adapter}`;
    const githubApiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await axios.get(githubApiUrl, { cache: false });
    const githubApiData = response.data;
    const branch = githubApiData.default_branch;
    const githubUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${branch}`;

    let ioPackageJson;
    try {
        ioPackageJson = await downloadFile(githubUrl, '/io-package.json');
    } catch (e) {
        console.log(`[WARNING] io-package.json not found - skipping`);
        return false;
    }

    if (typeof ioPackageJson === 'string') {
        try {
            ioPackageJson = JSON.parse(ioPackageJson);
        } catch (e) {
            throw( `[ERROR] Cannot parse io-package.json: ${e}`);
        }
    }

    if (ioPackageJson?.common?.adminUI?.config !== 'json') {
        console.log(`[INFO] io-package.json does not specify common.adminUI.config as 'json' - skipping`);
        return false;
    }

    const adminJsonFiles = await getAdminJsonFiles(githubApiUrl, branch);
    if (!adminJsonFiles.length) {
        console.log(`[INFO] no *.json or *.json5 files found in admin/ - skipping`);
        return false;
    }

    let foundCustom = false;
    for (const fileName of adminJsonFiles) {
        let content;
        try {
            content = await downloadFile(githubUrl, `/admin/${fileName}`);
        } catch (e) {
            console.log(`[INFO] cannot download admin/${fileName} - ignoring`);
            continue;
        }
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        if (/"type"\s*:\s*"custom"/.test(content)) {
            console.log(`[INFO] admin/${fileName} contains an element of type 'custom'`);
            foundCustom = true;
            break;
        }
    }

    if (!foundCustom) {
        console.log(`[INFO] none of the files in admin/ contain an element of type 'custom' - skipping`);
        return false;
    }

    const reportStart = `- [ ] ${context.owner}/ioBroker.${context.adapter}  - ${context.adapterInfo[context.adapter]?.user} user / rank ${context.adapterInfo[context.adapter]?.rank}`;
    context.report.push(`${reportStart}`);
    return true;
}

async function finalize(context) {

    console.log(context.report.sort().join('\n'));
    console.log(`\ncreated by template ${context.template}`);
}

exports.init=init;
exports.test=test;
exports.finalize=finalize;
