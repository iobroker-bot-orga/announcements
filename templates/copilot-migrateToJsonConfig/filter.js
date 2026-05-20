'use strict';

const axios = require('axios');

async function downloadFile(githubUrl, path) {
    console.log(`[INFO] download ${githubUrl}${path || ''}`);
    const response = await axios(githubUrl + (path || ''), {});
    return response.data;
}

async function fileExists(githubUrl, path) {
    try {
        await downloadFile(githubUrl, path);
        return true;
    } catch (e) {
        if (e.response && e.response.status === 404) {
            return false;
        }
        throw e;
    }
}

async function test(context) {
    if (context.owner !== 'iobroker-community-adapters') {
        console.log('[INFO] adapter is not maintained by iobroker-community-adapters - skipping');
        return false;
    }

    const repoUrl = `https://github.com/${context.owner}/ioBroker.${context.adapter}`;
    const githubApiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await axios.get(githubApiUrl, { cache: false });
    const githubApiData = response.data;
    const githubUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${githubApiData.default_branch}`;

    if (await fileExists(githubUrl, '/admin/jsonConfig.json')) {
        console.log('[INFO] adapter already contains admin/jsonConfig.json - skipping');
        return false;
    }

    if (await fileExists(githubUrl, '/admin/jsonConfig.json5')) {
        console.log('[INFO] adapter already contains admin/jsonConfig.json5 - skipping');
        return false;
    }

    let ioPackageJson;
    try {
        ioPackageJson = await downloadFile(githubUrl, '/io-package.json');
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

    if (ioPackageJson && ioPackageJson.common && ioPackageJson.common.adminUI && ioPackageJson.common.adminUI.config === 'none') {
        console.log('[INFO] io-package.json specifies common.adminUI.config as none - skipping');
        return false;
    }

    return true;
}

exports.test = test;
