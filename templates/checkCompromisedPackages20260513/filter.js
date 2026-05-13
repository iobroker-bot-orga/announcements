'use strict';

const axios = require('axios');

const COMPROMISED_PACKAGES = [
    { name: '@tanstack/arktype-adapter', versions: ['1.166.12', '1.166.15'] },
    { name: '@tanstack/eslint-plugin-router', versions: ['1.161.9', '1.161.12'] },
    { name: '@tanstack/eslint-plugin-start', versions: ['0.0.4', '0.0.7'] },
    { name: '@tanstack/history', versions: ['1.161.9', '1.161.12'] },
    { name: '@tanstack/nitro-v2-vite-plugin', versions: ['1.154.12', '1.154.15'] },
    { name: '@tanstack/react-router', versions: ['1.169.5', '1.169.8'] },
    { name: '@tanstack/react-router-devtools', versions: ['1.166.16', '1.166.19'] },
    { name: '@tanstack/react-router-ssr-query', versions: ['1.166.15', '1.166.18'] },
    { name: '@tanstack/react-start', versions: ['1.167.68', '1.167.71'] },
    { name: '@tanstack/react-start-client', versions: ['1.166.51', '1.166.54'] },
    { name: '@tanstack/react-start-rsc', versions: ['0.0.47', '0.0.50'] },
    { name: '@tanstack/react-start-server', versions: ['1.166.55', '1.166.58'] },
    { name: '@tanstack/router-cli', versions: ['1.166.46', '1.166.49'] },
    { name: '@tanstack/router-core', versions: ['1.169.5', '1.169.8'] },
    { name: '@tanstack/router-devtools', versions: ['1.166.16', '1.166.19'] },
    { name: '@tanstack/router-devtools-core', versions: ['1.167.6', '1.167.9'] },
    { name: '@tanstack/router-generator', versions: ['1.166.45', '1.166.48'] },
    { name: '@tanstack/router-plugin', versions: ['1.167.38', '1.167.41'] },
    { name: '@tanstack/router-ssr-query-core', versions: ['1.168.3', '1.168.6'] },
    { name: '@tanstack/router-utils', versions: ['1.161.11', '1.161.14'] },
    { name: '@tanstack/router-vite-plugin', versions: ['1.166.53', '1.166.56'] },
    { name: '@tanstack/solid-router', versions: ['1.169.5', '1.169.8'] },
    { name: '@tanstack/solid-router-devtools', versions: ['1.166.16', '1.166.19'] },
    { name: '@tanstack/solid-router-ssr-query', versions: ['1.166.15', '1.166.18'] },
    { name: '@tanstack/solid-start', versions: ['1.167.65', '1.167.68'] },
    { name: '@tanstack/solid-start-client', versions: ['1.166.50', '1.166.53'] },
    { name: '@tanstack/solid-start-server', versions: ['1.166.54', '1.166.57'] },
    { name: '@tanstack/start-client-core', versions: ['1.168.5', '1.168.8'] },
    { name: '@tanstack/start-fn-stubs', versions: ['1.161.9', '1.161.12'] },
    { name: '@tanstack/start-plugin-core', versions: ['1.169.23', '1.169.26'] },
    { name: '@tanstack/start-server-core', versions: ['1.167.33', '1.167.36'] },
    { name: '@tanstack/start-static-server-functions', versions: ['1.166.44', '1.166.47'] },
    { name: '@tanstack/start-storage-context', versions: ['1.166.38', '1.166.41'] },
    { name: '@tanstack/valibot-adapter', versions: ['1.166.12', '1.166.15'] },
    { name: '@tanstack/virtual-file-routes', versions: ['1.161.10', '1.161.13'] },
    { name: '@tanstack/vue-router', versions: ['1.169.5', '1.169.8'] },
    { name: '@tanstack/vue-router-devtools', versions: ['1.166.16', '1.166.19'] },
    { name: '@tanstack/vue-router-ssr-query', versions: ['1.166.15', '1.166.18'] },
    { name: '@tanstack/vue-start', versions: ['1.167.61', '1.167.64'] },
    { name: '@tanstack/vue-start-client', versions: ['1.166.46', '1.166.49'] },
    { name: '@tanstack/vue-start-server', versions: ['1.166.50', '1.166.53'] },
    { name: '@tanstack/zod-adapter', versions: ['1.166.12', '1.166.15'] },
];

const COMPROMISED_PACKAGE_VERSIONS = new Map(COMPROMISED_PACKAGES.map(pkg => [pkg.name, new Set(pkg.versions)]));
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const SUSPICIOUS_GITHUB_REFERENCE = 'github:tanstack/router';
const SUSPICIOUS_SETUP_PACKAGE = '@tanstack/setup';

async function downloadFile(githubUrl, path) {
    console.log(`[INFO] download ${githubUrl}/${path}`);
    try {
        const response = await axios(`${githubUrl}/${path}`);
        return response.data;
    } catch (e) {
        console.log(`[ERROR] cannot download ${githubUrl}/${path} ${e}`);
        throw e;
    }
}

async function downloadJson(githubUrl, path) {
    let data = await downloadFile(githubUrl, path);
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    return data;
}

async function getRepositoryTree(githubApiUrl, branch) {
    console.log(`[INFO] download repository tree for branch ${branch}`);
    const response = await axios.get(`${githubApiUrl}/git/trees/${encodeURIComponent(branch)}?recursive=1`, { cache: false });
    return response.data.tree || [];
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function specMatchesVersion(spec, version) {
    if (typeof spec !== 'string' || typeof version !== 'string') {
        return false;
    }

    return new RegExp(`(^|[^0-9A-Za-z-])${escapeRegExp(version)}([^0-9A-Za-z-]|$)`).test(spec);
}

function addFinding(findings, message) {
    if (message) {
        findings.add(message);
    }
}

function addCompromisedDependencyFindings(findings, location, dependencyName, spec) {
    const versions = COMPROMISED_PACKAGE_VERSIONS.get(dependencyName);
    if (!versions || typeof spec !== 'string') {
        return;
    }

    for (const version of versions) {
        if (specMatchesVersion(spec, version)) {
            addFinding(findings, `${location}: references compromised package ${dependencyName}@${version}`);
        }
    }
}

function inspectDependencyMap(findings, dependencyMap, location) {
    if (!dependencyMap || typeof dependencyMap !== 'object') {
        return;
    }

    for (const [dependencyName, spec] of Object.entries(dependencyMap)) {
        const dependencySpec = typeof spec === 'string' ? spec : JSON.stringify(spec);

        if (dependencyName === SUSPICIOUS_SETUP_PACKAGE) {
            addFinding(findings, `${location}: references ${SUSPICIOUS_SETUP_PACKAGE} (${dependencySpec})`);
        }
        if (dependencySpec && dependencySpec.includes(SUSPICIOUS_GITHUB_REFERENCE)) {
            addFinding(findings, `${location}: ${dependencyName} uses ${SUSPICIOUS_GITHUB_REFERENCE}`);
        }
        addCompromisedDependencyFindings(findings, location, dependencyName, dependencySpec);
    }
}

function inspectPackageJson(findings, packageJson, path) {
    for (const dependencySection of DEPENDENCY_SECTIONS) {
        inspectDependencyMap(findings, packageJson[dependencySection], `${path}#${dependencySection}`);
    }
}

function derivePackageNameFromLockPath(lockPath) {
    const marker = 'node_modules/';
    const lastMarker = lockPath.lastIndexOf(marker);
    if (lastMarker === -1) {
        return '';
    }

    return lockPath.slice(lastMarker + marker.length);
}

function addInstalledPackageFinding(findings, location, packageName, version) {
    if (!packageName || typeof version !== 'string') {
        return;
    }

    if (packageName === SUSPICIOUS_SETUP_PACKAGE) {
        addFinding(findings, `${location}: installs ${packageName}@${version}`);
    }

    const versions = COMPROMISED_PACKAGE_VERSIONS.get(packageName);
    if (versions && versions.has(version)) {
        addFinding(findings, `${location}: installs compromised package ${packageName}@${version}`);
    }
}

function inspectLockValue(findings, location, value) {
    if (typeof value !== 'string') {
        return;
    }

    if (value.includes(SUSPICIOUS_GITHUB_REFERENCE)) {
        addFinding(findings, `${location}: contains ${SUSPICIOUS_GITHUB_REFERENCE}`);
    }
}

function inspectPackageLockPackages(findings, packageLockJson, path) {
    if (!packageLockJson.packages || typeof packageLockJson.packages !== 'object') {
        return;
    }

    for (const [lockPath, pkg] of Object.entries(packageLockJson.packages)) {
        if (!pkg || typeof pkg !== 'object') {
            continue;
        }

        const packageName = pkg.name || derivePackageNameFromLockPath(lockPath);
        const location = `${path}#packages:${lockPath || '(root)'}`;

        addInstalledPackageFinding(findings, location, packageName, pkg.version);
        inspectLockValue(findings, `${location}:version`, pkg.version);
        inspectLockValue(findings, `${location}:resolved`, pkg.resolved);
        inspectLockValue(findings, `${location}:from`, pkg.from);

        for (const dependencySection of DEPENDENCY_SECTIONS) {
            inspectDependencyMap(findings, pkg[dependencySection], `${location}:${dependencySection}`);
        }
    }
}

function inspectPackageLockDependencies(findings, dependencies, path, parents) {
    if (!dependencies || typeof dependencies !== 'object') {
        return;
    }

    for (const [dependencyName, dependencyData] of Object.entries(dependencies)) {
        const trail = parents.concat(dependencyName).join(' > ');
        const location = `${path}#dependencies:${trail}`;

        if (dependencyData && typeof dependencyData === 'object') {
            addInstalledPackageFinding(findings, location, dependencyName, dependencyData.version);
            inspectLockValue(findings, `${location}:version`, dependencyData.version);
            inspectLockValue(findings, `${location}:resolved`, dependencyData.resolved);
            inspectLockValue(findings, `${location}:from`, dependencyData.from);
            inspectDependencyMap(findings, dependencyData.requires, `${location}:requires`);
            inspectPackageLockDependencies(findings, dependencyData.dependencies, path, parents.concat(dependencyName));
        }
    }
}

function getMatchingPaths(tree, fileName) {
    return tree
        .filter(item => item.type === 'blob' && item.path.split('/').pop() === fileName)
        .map(item => item.path)
        .sort();
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
    const findings = new Set();

    let tree = [];
    try {
        tree = await getRepositoryTree(githubApiUrl, githubApiData.default_branch);
    } catch (e) {
        console.log(`[WARNING] Could not process repository tree: ${e}`);
    }

    const routerInitPaths = getMatchingPaths(tree, 'router_init.js');
    for (const routerInitPath of routerInitPaths) {
        addFinding(findings, `repository contains ${routerInitPath}`);
    }

    const packageJsonPaths = getMatchingPaths(tree, 'package.json');
    const packageLockPaths = getMatchingPaths(tree, 'package-lock.json');

    if (!tree.length && !packageJsonPaths.length) {
        packageJsonPaths.push('package.json');
    }
    if (!tree.length && !packageLockPaths.length) {
        packageLockPaths.push('package-lock.json');
    }

    for (const packageJsonPath of packageJsonPaths) {
        try {
            const packageJson = await downloadJson(githubUrl, packageJsonPath);
            inspectPackageJson(findings, packageJson, packageJsonPath);
        } catch (e) {
            console.log(`[INFO] Could not process ${packageJsonPath}: ${e}`);
        }
    }

    for (const packageLockPath of packageLockPaths) {
        try {
            const packageLockJson = await downloadJson(githubUrl, packageLockPath);
            inspectPackageLockPackages(findings, packageLockJson, packageLockPath);
            inspectPackageLockDependencies(findings, packageLockJson.dependencies, packageLockPath, []);
        } catch (e) {
            console.log(`[INFO] Could not process ${packageLockPath}: ${e}`);
        }
    }

    const detectedIndicators = [...findings].sort();
    if (detectedIndicators.length > 0) {
        console.log(`[WARNING] Found potential compromise indicators: ${detectedIndicators.join('; ')}`);
        context.report.push(`- [ ] ${context.owner}/ioBroker.${context.adapter} - compromise indicators: ${detectedIndicators.join('; ')}`);
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
