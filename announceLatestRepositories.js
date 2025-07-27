#!/usr/bin/env node
'use strict';

const {parseArgs} = require('node:util');
const axios = require('axios');

const common = require('./lib/commonTools.js');
//const github = require('./lib/githubTools.js');
const iobroker = require('./lib/iobrokerTools.js');

const opts = {
    cleanup: false,
    dry: false,
    debug: false,
    from: '',
    template: '',
}

let checkScript;
const context = {};

function debug (text){
    if (opts.debug) {
        console.log(`[DEBUG] ${text}`);
    }
}

async function initCheck(context){
    debug(`initCheck('${context.template}')`);

    const filename = `${__dirname}/templates/${context.template}.js`;
    console.log(`[INFO] initializing checking script ${filename}`);

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
}

async function checkAnnouncement(context){
    debug(`checkAnnouncement('${context.template}')`);

    if (checkScript && checkScript.test) {
        return await checkScript.test(context);
    } else {
        return true;
    }
}

function triggerRepoAnnounce(owner, adapter) {
    let url = `${owner}/ioBroker.${adapter}`;

    debug(`trigger repo announcemengt for ${url}`);

    let flags = '';
    if (opts.cleanup) flags = flags + ' --cleanup';
    if (opts.dry) flags = flags + ' --dry';
    if (opts.debug) flags = flags + ' --debug';

    // curl -L -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ghp_xxxxxxxx" https://api.github.com/repos/iobroker-bot-orga/check-tasks/dispatches -d "{\"event_type\": \"check-repository\", \"client_payload\": {\"url\": \"mcm1957/iobroker.weblate-test\"}}"
    return axios.post(`https://api.github.com/repos/iobroker-bot-orga/announcements/dispatches`, {"event_type": "announce-repository", "client_payload": {"url": url, "template" : opts.template, "flags" : flags}},
        {
            headers: {
                Authorization: `bearer ${process.env.IOBBOT_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json',
                'user-agent': 'Action script'
            },
        })
        .then(response => response.data)
        .catch(e => console.error(e));
}

function triggerRestart(adapter) {

    debug(`trigger latest restart from ${adapter}`);

    let flags = `--from="${adapter}"`;
    if (opts.cleanup) flags = flags + ' --cleanup';
    if (opts.dry) flags = flags + ' --dry';
    if (opts.debug) flags = flags + ' --debug';

    // curl -L -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ghp_xxxxxxxx" https://api.github.com/repos/iobroker-bot-orga/check-tasks/dispatches -d "{\"event_type\": \"check-repository\", \"client_payload\": {\"url\": \"mcm1957/iobroker.weblate-test\"}}"
    return axios.post(`https://api.github.com/repos/iobroker-bot-orga/announcements/dispatches`, {"event_type": "announce-latest-restart", "client_payload": {"template": opts.template, "flags" : flags}},
        {
            headers: {
                Authorization: `bearer ${process.env.IOBBOT_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json',
                'user-agent': 'Action script'
            },
        })
        .then(response => { console.log (response.data)} )
        .catch(e => console.error(e));
}

async function main() {
    const options = {
        'cleanup': {
            type: 'boolean',
        },
        'dry': {
            type: 'boolean',
        },
        'debug': {
            type: 'boolean',
            short: 'd',
        },
        'from': {
            type: 'string',
        },
        'template': {
            type: 'string',
        },
    };

    const {
        values,
        positionals,
            } = parseArgs({ options, strict:true, allowPositionals:true,  });

    //console.log(values, positionals);

    opts.cleanup = values['cleanup'];
    opts.dry = values['dry'];
    opts.debug = values['debug'];
    opts.from = values['from'];
    opts.template = values['template'];

    const latestRepo = await iobroker.getLatestRepoLive();
    const total = Object.keys(latestRepo).length;
    const delay = 120; // seconds
    let counter = 3 * 60 * (60 / delay); /* delay 3h */

    console.log(`[INFO] delay set to ${delay} seconds`);
    console.log(`[INFO] will restart after 3h (${counter} announcements)`);

    context.template = opts.template;
    await initCheck(context);

    let curr = 0;
    let skip = opts.from && (opts.from !== '');
    if (skip) console.log (`--from set to "${opts.from}" - searching for first adapter to process ...`);
    for (const adapter in latestRepo) {
        if (!counter) {
            console.log(`[INFO] task will be restarted, next adapter is ${adapter}`);
            triggerRestart(adapter);
            break;
        };

        curr = curr + 1;
        if (adapter.startsWith('_')) continue;
        if (adapter === opts.from) skip = false;
        if (skip) {
            console.log (`skipping ${adapter}`);
            continue;
        }
	    	    
    	debug (`processing ${latestRepo[adapter].meta}`);

        const parts = latestRepo[adapter].meta.split('/');
        const owner = parts[3];
        console.log(`\n[INFO] processing ${owner}/ioBroker.${adapter} (${curr}/${total})`);

        context.owner = owner;
        context.adapter = adapter;        
        if ( ! await checkAnnouncement(context)) {
            console.log(`[INFO] SKIPPING ${owner}/ioBroker.${adapter} (${curr}/${total})`);
        } else {
	    if (! opts.dry) {
	        triggerRepoAnnounce(owner, adapter);
	    } else {
                console.log (`[DRY] would trigger ${owner}/ioBroker.${adapter}`)
            }
	}

	counter=counter-1;
	if (counter) {
	    console.log(`will restart after ${counter} announcements, sleeping (${delay}s) ...`);
	} else {
	    console.log(`will restart after delay, sleeping (${delay}s) ...`);            
	}
	await common.sleep(delay*1000);
    }

    if (checkScript && checkScript.finalize) {
        await checkScript.finalize(context);
    }

    console.log(`[INFO] task completed`);            
}

process.env.OWN_GITHUB_TOKEN = process.env.IOBBOT_GITHUB_TOKEN;
main();
