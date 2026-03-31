'use strict';

const axios = require('axios');

const COMPROMISED_PACKAGES = [
    { name: 'axios', version: '1.14.1' },
    { name: 'axios', version: '0.30.4' },
    { name: 'plain-crypto-js', version: '4.2.1' },
];

async function downloadFile(githubUrl, path) {
    console.log(`[INFO] download ${githubUrl}${path || ''}`);
    try {
        const response = await axios(githubUrl + (path || ''), {});
        return response.data;
    } catch (e) {
        console.log(`[ERROR] cannot download ${githubUrl}${path || ''} ${e}`);
        throw e;
    }
}

function findCompromisedInPackageJson(packageJson) {
    const found = [];
    const allDeps = Object.assign(
        {},
        packageJson.dependencies || {},
        packageJson.devDependencies || {},
        packageJson.optionalDependencies || {},
        packageJson.peerDependencies || {}
    );

    for (const pkg of COMPROMISED_PACKAGES) {
        const version = allDeps[pkg.name];
        if (version) {
            const normalized = version.replace(/^[\^~]/, '');
            if (normalized === pkg.version) {
                found.push(`${pkg.name}@${pkg.version}`);
            }
        }
    }
    return found;
}

function findCompromisedInPackageLockJson(packageLockJson) {
    const found = [];

    // npm v2/v3 format
    if (packageLockJson.packages) {
        for (const pkg of COMPROMISED_PACKAGES) {
            const key = `node_modules/${pkg.name}`;
            if (packageLockJson.packages[key] && packageLockJson.packages[key].version === pkg.version) {
                found.push(`${pkg.name}@${pkg.version}`);
            }
        }
    }

    // npm v1 format
    if (packageLockJson.dependencies) {
        for (const pkg of COMPROMISED_PACKAGES) {
            if (packageLockJson.dependencies[pkg.name] && packageLockJson.dependencies[pkg.name].version === pkg.version) {
                const entry = `${pkg.name}@${pkg.version}`;
                if (!found.includes(entry)) {
                    found.push(entry);
                }
            }
        }
    }

    return found;
}

async function init(context) {
    context.report = [];
}

async function test(context) {
    const repoUrl = `https://github.com/${context.owner}/ioBroker.${context.adapter}`;
    const githubApiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await axios.get(githubApiUrl, { cache: false });
    const githubApiData = response.data;
    const githubUrl = `${repoUrl.replace('https://github.com', 'https://raw.githubusercontent.com')}/${githubApiData.default_branch}`;

    const found = [];

    // Check package.json
    try {
        let packageJson = await downloadFile(githubUrl, '/package.json');
        if (typeof packageJson === 'string') {
            packageJson = JSON.parse(packageJson);
        }
        const compromised = findCompromisedInPackageJson(packageJson);
        found.push(...compromised);
    } catch (e) {
        console.log(`[WARNING] Could not process package.json: ${e}`);
    }

    // Check package-lock.json
    try {
        let packageLockJson = await downloadFile(githubUrl, '/package-lock.json');
        if (typeof packageLockJson === 'string') {
            packageLockJson = JSON.parse(packageLockJson);
        }
        const compromised = findCompromisedInPackageLockJson(packageLockJson);
        for (const entry of compromised) {
            if (!found.includes(entry)) {
                found.push(entry);
            }
        }
    } catch (e) {
        console.log(`[INFO] Could not process package-lock.json (may not exist): ${e}`);
    }

    if (found.length > 0) {
        console.log(`[WARNING] Found compromised packages: ${found.join(', ')}`);
        context.report.push(`- [ ] ${context.owner}/ioBroker.${context.adapter} - compromised packages: ${found.join(', ')}`);
        return true;
    }

    return false;
}

async function finalize(context) {
    console.log(context.report.sort().join('\n'));
    console.log(`\ncreated by template ${context.template}`);
}

exports.init = init;
exports.test = test;
exports.finalize = finalize;
