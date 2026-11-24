'use strict';

const axios = require('axios');

async function downloadFile(url) {
    console.log(`[INFO] download ${url}`);
    const response = await axios(url);
    return response.data;
}

async function fileExists(url) {
    try {
        await downloadFile(url);
        return true;
    } catch (e) {
        if (e.response && e.response.status === 404) {
            return false;
        }
        throw e;
    }
}

async function test(context) {
    const repoUrl = `https://github.com/${context.owner}/ioBroker.${context.adapter}`;
    const githubApiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await axios.get(githubApiUrl);
    const githubApiData = response.data;
    const rawBaseUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${githubApiData.default_branch}`;

    let ioPackageJson;
    try {
        ioPackageJson = await downloadFile(`${rawBaseUrl}/io-package.json`);
    } catch (e) {
        if (e.response && e.response.status === 404) {
            console.log('[INFO] io-package.json not found - skipping');
            return false;
        }
        throw e;
    }

    if (typeof ioPackageJson === 'string') {
        ioPackageJson = JSON.parse(ioPackageJson);
    }

    const connectionType = ioPackageJson && ioPackageJson.common && ioPackageJson.common.connectionType;
    if (connectionType !== 'local') {
        console.log(`[INFO] common.connectionType is "${connectionType}", not "local" - skipping`);
        return false;
    }

    const discoveryFileUrl = `https://raw.githubusercontent.com/ioBroker/ioBroker.discovery/master/src/lib/adapters/${context.adapter}.ts`;
    if (await fileExists(discoveryFileUrl)) {
        console.log(`[INFO] ${context.adapter}.ts already exists in ioBroker.discovery - skipping`);
        return false;
    }

    return true;
}

exports.test = test;
