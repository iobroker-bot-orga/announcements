//
// select all adapter which have set
// - common.adminUI.config === json or
// - common.adminUI.custom === json 
//

'use strict';

const axios = require('axios');
const compareVersions = require('compare-versions');


async function downloadFile(githubUrl, path) {
    console.log(`[INFO] download ${githubUrl}${path || ''}`);

    const options = {};
    try {
        const response = await axios(githubUrl + (path || ''), options);
        return (response.data);
    } catch (e) {
        console.log(`[ERROR] cannot download ${githubUrl}${path || ''} ${e}`);
        throw e;
    }
}

async function init(context) {
    context.report = [];

    const response = await axios.get('https://www.iobroker.net/data/statistics.json');
    const statistics = response.data;
    const adapters = statistics.adapters;

    let adapterArray=[];
    for (const [adapter, count] of Object.entries(adapters)) {
        //console.log(`adapter: ${adapter}, count: ${count}`);
        const entry = `${count.toString().padStart(10,'0')}:${adapter}`;
        adapterArray.push(entry);
    }
    adapterArray=adapterArray.sort().reverse();
    // console.log (adapterArray.join('\n'));

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

async function test(context) {

    const repoUrl =  `https://github.com/${context.owner}/ioBroker.${context.adapter}`;
    const githubApiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await axios.get(githubApiUrl, { cache: false });
    const githubApiData = response.data;
    const githubUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${githubApiData.default_branch}`;   

    //console.log(`[INFO] ${githubUrl}`);

    let packageJson = await downloadFile(githubUrl, '/package.json')
    if (typeof packageJson === 'string') {
        try {
            packageJson = JSON.parse(packageJson);
        } catch (e) {
            throw ( `[ERROR] Cannot parse package.json: ${e}`);
        }
    }

    if (!packageJson.devDependencies) {
        console.log(`[ERROR] package.json does not contain devDependencies section - skipping`);
        return false;
    }

    if (!packageJson.devDependencies.eslint) {
        console.log(`[INFO] package.json does not contain eslint - skipping`);
        return false;
    }

    let dependencyVersion = packageJson.devDependencies.eslint;
    dependencyVersion = dependencyVersion.replace(/[\^~]/, '');
    if ( compareVersions.compare(dependencyVersion, '9.0.0', '>=') ) {
        console.log(`[INFO] package.json specifies eslint ${packageJson.devDependencies.eslint} - skipping`);
        return false;
    }

    console.log(`[INFO] package.json specifies eslint ${packageJson.devDependencies.eslint} - dropping notification`);

    const reportStart = `- [ ] ${context.owner}/ioBroker.${context.adapter}  - ${context.adapterInfo[context.adapter].user} user / rank ${context.adapterInfo[context.adapter].rank}`;
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