'use strict';

const axios = require('axios');
const compareVersions = require('compare-versions');

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
}

async function test(context){

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
            throw( `[ERROR] Cannot parse package.json: ${e}`);
        }
    }

    let ioPackageJson;
    try {
        ioPackageJson = await downloadFile(githubUrl, '/io-package.json')
    } catch (e) { /* ignore missing file, i.e. admin */};
    if (ioPackageJson) {
        if (typeof ioPackageJson === 'string') {
            try {
                ioPackageJson = JSON.parse(ioPackageJson);
            } catch (e) {
                throw( `[ERROR] Cannot parse io-package.json: ${e}`);
            }
        }

        if (ioPackageJson?.common?.onlyWWW) {
            console.log(`[INFO] onlyWWW adapter - skipping`);
            return false;
        }
    }

    const reportStart = `- [ ] ${context.owner}/ioBroker.${context.adapter}`;

    if (!packageJson.dependencies) {
        console.log(`[WARNING] No dependencies declared at all`);
        context.report.push(`${reportStart} - no dependencies`);
        return true;
    }

    let dependencyVersion = packageJson.dependencies[`@iobroker/adapter-core`] || '';
    dependencyVersion = dependencyVersion.replace(/[\^~]/,'' );
    if (!dependencyVersion) {
        console.log(`[WARNING] No dependency declared for @iobroker/adapter-core`);
        context.report.push(`${reportStart} - no dependency`);
        return true;
    }
    console.log(`[INFO] Dependency ${dependencyVersion} declared for @iobroker/adapter-core`);
    if (! compareVersions.compare( dependencyVersion, '3.0.0', '>=' )) {
        context.report.push(`${reportStart} - "@iobroker/adapter-core":"${packageJson.dependencies['@iobroker/adapter-core']}"`);
        return true;
    }
    return false;
}

async function finalize(context) {

    console.log(context.report.sort().join('\n'));
    console.log(`\ncreated by template ${context.template}`);
}

exports.init=init;
exports.test=test;
exports.finalize=finalize;