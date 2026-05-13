'use strict';

const axios = require('axios');

const COMPROMISED_PACKAGES = [
    { name: '@beproduct/nestjs-auth', versions: ['0.1.2', '0.1.3', '0.1.4', '0.1.5', '0.1.6', '0.1.7', '0.1.8', '0.1.9', '0.1.10', '0.1.11', '0.1.12', '0.1.13', '0.1.14', '0.1.15', '0.1.16', '0.1.17', '0.1.18', '0.1.19'] },
    { name: '@dirigible-ai/sdk', versions: ['0.6.2', '0.6.3'] },
    { name: '@draftauth/client', versions: ['0.2.1', '0.2.2'] },
    { name: '@draftauth/core', versions: ['0.13.1', '0.13.2'] },
    { name: '@draftlab/auth', versions: ['0.24.1', '0.24.2'] },
    { name: '@draftlab/auth-router', versions: ['0.5.1', '0.5.2'] },
    { name: '@draftlab/db', versions: ['0.16.1'] },
    { name: '@mesadev/rest', versions: ['0.28.3'] },
    { name: '@mesadev/saguaro', versions: ['0.4.22'] },
    { name: '@mesadev/sdk', versions: ['0.28.3'] },
    { name: '@mistralai/mistralai', versions: ['2.2.2', '2.2.3', '2.2.4'] },
    { name: '@mistralai/mistralai-azure', versions: ['1.7.1', '1.7.2', '1.7.3'] },
    { name: '@mistralai/mistralai-gcp', versions: ['1.7.1', '1.7.2', '1.7.3'] },
    { name: '@ml-toolkit-ts/preprocessing', versions: ['1.0.2', '1.0.3'] },
    { name: '@ml-toolkit-ts/xgboost', versions: ['1.0.3', '1.0.4'] },
    { name: '@squawk/airport-data', versions: ['0.7.4', '0.7.5', '0.7.6', '0.7.7'] },
    { name: '@squawk/airports', versions: ['0.6.2', '0.6.3', '0.6.4', '0.6.5'] },
    { name: '@squawk/airspace', versions: ['0.8.1', '0.8.2', '0.8.3', '0.8.4'] },
    { name: '@squawk/airspace-data', versions: ['0.5.3', '0.5.4', '0.5.5', '0.5.6'] },
    { name: '@squawk/airway-data', versions: ['0.5.4', '0.5.5', '0.5.6', '0.5.7'] },
    { name: '@squawk/airways', versions: ['0.4.2', '0.4.3', '0.4.4', '0.4.5'] },
    { name: '@squawk/fix-data', versions: ['0.6.4', '0.6.5', '0.6.6', '0.6.7'] },
    { name: '@squawk/fixes', versions: ['0.3.2', '0.3.3', '0.3.4', '0.3.5'] },
    { name: '@squawk/flight-math', versions: ['0.5.4', '0.5.5', '0.5.6', '0.5.7'] },
    { name: '@squawk/flightplan', versions: ['0.5.2', '0.5.3', '0.5.4', '0.5.5'] },
    { name: '@squawk/geo', versions: ['0.4.4', '0.4.5', '0.4.6', '0.4.7'] },
    { name: '@squawk/icao-registry', versions: ['0.5.2', '0.5.3', '0.5.4', '0.5.5'] },
    { name: '@squawk/icao-registry-data', versions: ['0.8.4', '0.8.5', '0.8.6', '0.8.7'] },
    { name: '@squawk/mcp', versions: ['0.9.1', '0.9.2', '0.9.3', '0.9.4'] },
    { name: '@squawk/navaid-data', versions: ['0.6.4', '0.6.5', '0.6.6', '0.6.7'] },
    { name: '@squawk/navaids', versions: ['0.4.2', '0.4.3', '0.4.4', '0.4.5'] },
    { name: '@squawk/notams', versions: ['0.3.6', '0.3.7', '0.3.8', '0.3.9'] },
    { name: '@squawk/procedure-data', versions: ['0.7.3', '0.7.4', '0.7.5', '0.7.6'] },
    { name: '@squawk/procedures', versions: ['0.5.2', '0.5.3', '0.5.4', '0.5.5'] },
    { name: '@squawk/types', versions: ['0.8.2', '0.8.3', '0.8.4'] },
    { name: '@squawk/units', versions: ['0.4.3', '0.4.4', '0.4.5', '0.4.6'] },
    { name: '@squawk/weather', versions: ['0.5.6', '0.5.7', '0.5.8', '0.5.9'] },
    { name: '@supersurkhet/cli', versions: ['0.0.2', '0.0.3', '0.0.4', '0.0.5', '0.0.6', '0.0.7'] },
    { name: '@supersurkhet/sdk', versions: ['0.0.2', '0.0.3', '0.0.4', '0.0.5', '0.0.6', '0.0.7'] },
    { name: '@tallyui/components', versions: ['1.0.1', '1.0.2', '1.0.3'] },
    { name: '@tallyui/connector-medusa', versions: ['1.0.1', '1.0.2', '1.0.3'] },
    { name: '@tallyui/connector-shopify', versions: ['1.0.1', '1.0.2', '1.0.3'] },
    { name: '@tallyui/connector-vendure', versions: ['1.0.1', '1.0.2', '1.0.3'] },
    { name: '@tallyui/connector-woocommerce', versions: ['1.0.1', '1.0.2', '1.0.3'] },
    { name: '@tallyui/core', versions: ['0.2.1', '0.2.2', '0.2.3'] },
    { name: '@tallyui/database', versions: ['1.0.1', '1.0.2', '1.0.3'] },
    { name: '@tallyui/pos', versions: ['0.1.1', '0.1.2', '0.1.3'] },
    { name: '@tallyui/storage-sqlite', versions: ['0.2.1', '0.2.2', '0.2.3'] },
    { name: '@tallyui/theme', versions: ['0.2.1', '0.2.2', '0.2.3'] },
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
    { name: '@taskflow-corp/cli', versions: ['0.1.24', '0.1.25', '0.1.26', '0.1.27', '0.1.28', '0.1.29'] },
    { name: '@tolka/cli', versions: ['1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.0.6'] },
    { name: '@uipath/access-policy-sdk', versions: ['0.3.1'] },
    { name: '@uipath/access-policy-tool', versions: ['0.3.1'] },
    { name: '@uipath/admin-tool', versions: ['0.1.1'] },
    { name: '@uipath/agent-sdk', versions: ['1.0.2'] },
    { name: '@uipath/agent-tool', versions: ['1.0.1'] },
    { name: '@uipath/agent.sdk', versions: ['0.0.18'] },
    { name: '@uipath/aops-policy-tool', versions: ['0.3.1'] },
    { name: '@uipath/ap-chat', versions: ['1.5.7'] },
    { name: '@uipath/api-workflow-tool', versions: ['1.0.1'] },
    { name: '@uipath/apollo-core', versions: ['5.9.2'] },
    { name: '@uipath/apollo-react', versions: ['4.24.5'] },
    { name: '@uipath/apollo-wind', versions: ['2.16.2'] },
    { name: '@uipath/auth', versions: ['1.0.1'] },
    { name: '@uipath/case-tool', versions: ['1.0.1'] },
    { name: '@uipath/cli', versions: ['1.0.1'] },
    { name: '@uipath/codedagent-tool', versions: ['1.0.1'] },
    { name: '@uipath/codedagents-tool', versions: ['0.1.12'] },
    { name: '@uipath/codedapp-tool', versions: ['1.0.1'] },
    { name: '@uipath/common', versions: ['1.0.1'] },
    { name: '@uipath/context-grounding-tool', versions: ['0.1.1'] },
    { name: '@uipath/data-fabric-tool', versions: ['1.0.2'] },
    { name: '@uipath/docsai-tool', versions: ['1.0.1'] },
    { name: '@uipath/filesystem', versions: ['1.0.1'] },
    { name: '@uipath/flow-tool', versions: ['1.0.2'] },
    { name: '@uipath/functions-tool', versions: ['1.0.1'] },
    { name: '@uipath/gov-tool', versions: ['0.3.1'] },
    { name: '@uipath/identity-tool', versions: ['0.1.1'] },
    { name: '@uipath/insights-sdk', versions: ['1.0.1'] },
    { name: '@uipath/insights-tool', versions: ['1.0.1'] },
    { name: '@uipath/integrationservice-sdk', versions: ['1.0.2'] },
    { name: '@uipath/integrationservice-tool', versions: ['1.0.2'] },
    { name: '@uipath/llmgw-tool', versions: ['1.0.1'] },
    { name: '@uipath/maestro-sdk', versions: ['1.0.1'] },
    { name: '@uipath/maestro-tool', versions: ['1.0.1'] },
    { name: '@uipath/orchestrator-tool', versions: ['1.0.1'] },
    { name: '@uipath/packager-tool-apiworkflow', versions: ['0.0.19'] },
    { name: '@uipath/packager-tool-bpmn', versions: ['0.0.9'] },
    { name: '@uipath/packager-tool-case', versions: ['0.0.9'] },
    { name: '@uipath/packager-tool-connector', versions: ['0.0.19'] },
    { name: '@uipath/packager-tool-flow', versions: ['0.0.19'] },
    { name: '@uipath/packager-tool-functions', versions: ['0.1.1'] },
    { name: '@uipath/packager-tool-webapp', versions: ['1.0.6'] },
    { name: '@uipath/packager-tool-workflowcompiler', versions: ['0.0.16'] },
    { name: '@uipath/packager-tool-workflowcompiler-browser', versions: ['0.0.34'] },
    { name: '@uipath/platform-tool', versions: ['1.0.1'] },
    { name: '@uipath/project-packager', versions: ['1.1.16'] },
    { name: '@uipath/resource-tool', versions: ['1.0.1'] },
    { name: '@uipath/resourcecatalog-tool', versions: ['0.1.1'] },
    { name: '@uipath/resources-tool', versions: ['0.1.11'] },
    { name: '@uipath/robot', versions: ['1.3.4'] },
    { name: '@uipath/rpa-legacy-tool', versions: ['1.0.1'] },
    { name: '@uipath/rpa-tool', versions: ['0.9.5'] },
    { name: '@uipath/solution-packager', versions: ['0.0.35'] },
    { name: '@uipath/solution-tool', versions: ['1.0.1'] },
    { name: '@uipath/solutionpackager-sdk', versions: ['1.0.11'] },
    { name: '@uipath/solutionpackager-tool-core', versions: ['0.0.34'] },
    { name: '@uipath/tasks-tool', versions: ['1.0.1'] },
    { name: '@uipath/telemetry', versions: ['0.0.7'] },
    { name: '@uipath/test-manager-tool', versions: ['1.0.2'] },
    { name: '@uipath/tool-workflowcompiler', versions: ['0.0.12'] },
    { name: '@uipath/traces-tool', versions: ['1.0.1'] },
    { name: '@uipath/ui-widgets-multi-file-upload', versions: ['1.0.1'] },
    { name: '@uipath/uipath-python-bridge', versions: ['1.0.1'] },
    { name: '@uipath/vertical-solutions-tool', versions: ['1.0.1'] },
    { name: '@uipath/vss', versions: ['0.1.6'] },
    { name: '@uipath/widget.sdk', versions: ['1.2.3'] },
    { name: 'agentwork-cli', versions: ['0.1.4', '0.1.5'] },
    { name: 'cmux-agent-mcp', versions: ['0.1.3', '0.1.4', '0.1.5', '0.1.6', '0.1.7', '0.1.8'] },
    { name: 'cross-stitch', versions: ['1.1.3', '1.1.4', '1.1.5', '1.1.6'] },
    { name: 'git-branch-selector', versions: ['1.3.3', '1.3.4', '1.3.5', '1.3.6', '1.3.7'] },
    { name: 'git-git-git', versions: ['1.0.8', '1.0.9', '1.0.10', '1.0.11', '1.0.12'] },
    { name: 'ml-toolkit-ts', versions: ['1.0.4', '1.0.5'] },
    { name: 'nextmove-mcp', versions: ['0.1.3', '0.1.4', '0.1.5', '0.1.6', '0.1.7'] },
    { name: 'safe-action', versions: ['0.8.3', '0.8.4'] },
    { name: 'ts-dna', versions: ['3.0.1', '3.0.2', '3.0.3', '3.0.4'] },
    { name: 'wot-api', versions: ['0.8.1', '0.8.2', '0.8.3', '0.8.4'] },
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
    const response = await axios.get(`${githubApiUrl}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
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
    const response = await axios.get(githubApiUrl);
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
