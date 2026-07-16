//
// select all adapter which have set
// - common.adminUI.config === json or
// - common.adminUI.custom === json 
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

async function init(context){
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
    console.log (adapterArray.join('\n'));

    const adapterInfo = {};
    let rank = 1;
    for (let entry of adapterArray) {
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
    const githubUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${githubApiData.default_branch}`;   

    //console.log(`[INFO] ${githubUrl}`);

    // let packageJson = await downloadFile(githubUrl, '/package.json')
    // if (typeof packageJson === 'string') {
    //     try {
    //         packageJson = JSON.parse(packageJson);
    //     } catch (e) {
    //         throw( `[ERROR] Cannot parse package.json: ${e}`);
    //     }
    // }

    let ioPackageJson;
    try {
        ioPackageJson = await downloadFile(githubUrl, '/io-package.json')
    } catch (e) { /* ignore missing file, i.e. admin */};
 
    if (!ioPackageJson) {
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

    if (!ioPackageJson.common) {
        console.log(`[ERROR] io-package.json does not contain a common section - skipping`);
        return false;
    }

    if (!ioPackageJson.common.adminUI) {
        console.log(`[INFO] io-package.json does not contain adminUI - skipping`);
        return false;
    }


    if ((ioPackageJson.common.adminUI.config !== 'json') && (ioPackageJson.common.adminUI.custom !== 'json')) {
        console.log(`[INFO] adapter does not use jsonConfig - skipping`);
        return false;
    }

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