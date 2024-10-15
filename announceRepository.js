#!/usr/bin/env node

const axios = require('axios');
const fs = require('node:fs');
const {parseArgs} = require('node:util');

//const common = require('../../lib/commonTools.js');
const github = require('./lib/githubTools.js');
const iobroker = require('./lib/iobrokerTools.js');

const opts = {
    debug: false,
    dry: false,
    template: ''
}

function debug (text){
    if (opts.debug) {
        console.log(`[DEBUG] ${text}`);
    }
}

async function checkAnnouncement(context){
    debug(`checkAnnouncement('${context.template}')`);

    const filename = `${__dirname}/templates/${context.template}.js`;
    console.log(`[INFO] activating checking script ${filename}`);

    let checkScript;
    try {
        checkScript = require(filename); 
    } catch (e) {
        if ( e.code === 'MODULE_NOT_FOUND') {
            console.log(`[INFO] no checking script found`);
        } else {
            throw(e);
        }
    }

    if (checkScript && checkScript.init) {
        await checkScript.init(context);
    }

    if (checkScript && checkScript.test) {
        return await checkScript.test(context);
    } else {
        return true;
    }
}

async function getAnnouncement(template){
    debug(`getAnnouncement('${template}')`);

    const filename = `${__dirname}/templates/${template}.md`;
    console.log(`[INFO] loading ${filename}`);

    const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' } );
    if (!data){
        throw(`Cannot read file ${filename}`);
    }

    const announcement = {};
    const lines = data.split('\n').map( x => x.replace('\r',''));
    announcement.title = lines.shift();
    announcement.body = lines.join('\n');

    debug(`TITLE: ${announcement.title}`);
    debug(`\nBODY:\n ${announcement.body}`);
    
    return announcement;
}

async function getOldIssues(owner, repo, title) {
    debug(`getOldIssues('${owner}', '${repo}')`);

    let issues = await github.getAllIssues(owner, repo);
    if (!issues) issues = [];
    issues = issues.filter(i => i.state === 'open' && i.title.includes(title));
    return issues;
}

async function createNewIssue(owner, repo, announcement ) {
    debug(`createNewIssues('${owner}', '${repo}', 'anouncement')`);

    if (opts.dry) {
        console.log (`[DRY] would create new issue`)
        console.log (announcement.title);
        console.log (announcement.body);
        return 0;
    };

    const response = await github.createIssue( owner, repo, { 
        title: announcement.title,
        body: announcement.body});
        
    const id = response.url.split('/').pop();
    debug(`new issue  created with id ${id}`);
    return id;
}

async function closeIssue (owner, repo, id, reason) {
    debug(`closeIssue('${owner}', '${repo}', ${id}, ${reason})`);

    const oldComments = await github.getAllComments(owner, repo, id);
    let exists = oldComments && oldComments.find(comment => comment.body.includes('This issue can be closed.'));
    if (!exists) {
        const comment = `${reason}  \n` +
            `This issue will be closed.  \n  \n` +
            `your  \n` +
            `_ioBroker Check and Service Bot_\n`;

        if (!opts.dry) {
            await github.addComment(owner, repo, id, comment);
        } else {
            console.log (`[DRY] would add comment "${comment}"`)
        }
    };

    if (!opts.dry) {
        await github.closeIssue(owner, repo, id);
        debug(`issue ${id} has been closed`);
    } else {
        console.log (`[DRY] would close issue #${id}`)
    }
}

async function main() {
    const options = {
        'template': {
            type: 'string',
        },
        'debug': {
            type: 'boolean',
            short: 'd',
        },
        'dry': {
            type: 'boolean',
        },
    };

    const {
        values,
        positionals,
            } = parseArgs({ options, strict:true, allowPositionals:true,  });

    //console.log(values, positionals);

    const context = {};

    opts.debug = values['debug'];
    opts.dry = values['dry'];
    opts.template = values['template'];

    if (positionals.length != 1) {
        console.log ('[ERROR] Please specify exactly one repository');
        process.exit (1);
    }

    if (!opts.template || (opts.template.trim() === '')) {
        console.log ('[ERROR] Please specify template (--template=name');
        process.exit (1);
    }

    let repoUrl = positionals[0];
    if (!repoUrl.toLowerCase().includes('github.com')) {
        repoUrl =  `https://github.com/${repoUrl}`
    }

    const owner = iobroker.getOwner(repoUrl);
    const adapter = iobroker.getAdapterName(repoUrl);
    const repo = `ioBroker.${adapter}`;

    context.template = opts.template;
    context.owner = owner;
    context.adapter = adapter;

    console.log(`[INFO] processing ${repoUrl}`);

    // get title an body
    const announcement = await getAnnouncement(opts.template);

    // process filter if available
    const check = await checkAnnouncement(context);
    if (!check) {
        console.log(`[INFO] repository should be skipped according to check script`);
    } else {
        // check if older issues exists
        let issues = await getOldIssues(owner, repo, announcement.title);
        const oldIssueId = issues[0]?.number || 0;
        debug(`detected existing issue ${oldIssueId}`);

        // if no issue exists, create a new one, else update old one
        if (!oldIssueId) {
                await createNewIssue(owner, repo, announcement);
        } else if (opts.recreate) {
            const newIssueId = await createNewIssue(owner, repo, announcement);
            closeIssue(owner, repo, oldIssueId, `Issue outdated due to RECREATE request. Follow up issue #${newIssueId} has been created.`);
            console.log(`[INFO] old issue ${oldIssueId} closed due to --recreate request`);
        } else {
            console.log(`[INFO] nothing to do as old issue ${oldIssueId} exists`);
        }
    }
    console.log('[INFO] processing completed');
}

process.env.OWN_GITHUB_TOKEN = process.env.IOBBOT_GITHUB_TOKEN;
main();
