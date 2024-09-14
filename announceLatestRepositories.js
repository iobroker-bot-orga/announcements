#!/usr/bin/env node
'use strict';

const {parseArgs} = require('node:util');
const axios = require('axios');

const common = require('lib/commonTools.js');
//const github = require('lib/githubTools.js');
const iobroker = require('lib/iobrokerTools.js');

const opts = {
    cleanup: false,
    dry: false,
    debug: false,
    from: '',
    template: '',
}

function debug (text){
    if (opts.debug) {
        console.log(`[DEBUG] ${text}`);
    }
}

function triggerRepoAnnounce(owner, adapter) {
    let url = `${owner}/ioBroker.${adapter}`;

    debug(`trigger repo announcemengt for ${url}`);

    // curl -L -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ghp_xxxxxxxx" https://api.github.com/repos/iobroker-bot-orga/check-tasks/dispatches -d "{\"event_type\": \"check-repository\", \"client_payload\": {\"url\": \"mcm1957/iobroker.weblate-test\"}}"
    return axios.post(`https://api.github.com/repos/iobroker-bot-orga/announcements/dispatches`, {"event_type": "announce-repository", "client_payload": {"url": url, "template" : template, "flags" : flags}},
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
            type: 'from',
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
    opts.template = values['template'];

    const latestRepo = await iobroker.getLatestRepoLive();
    const total = Object.keys(latestRepo).length;
    let curr = 0;
    let skip = opts.from && (opts.from !== '');
    if (skip) console.log (`--from set to "${opts.from}" - searching for first adapter to process ...`);
    for (const adapter in latestRepo) {
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
        console.log(`[INFO] processing ${owner}/ioBroker.${adapter} (${curr}/${total})`);

        triggerRepoCheck(owner, adapter);
        console.log('sleeping (90s) ...')
        await common.sleep(90000);
        process.exit(1);
}
}

process.env.OWN_GITHUB_TOKEN = process.env.IOBBOT_GITHUB_TOKEN;
main();
