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

async function createTopList(){

    const latestRepo = await iobroker.getLatestRepoLive();
    const response = await axios.get('https://www.iobroker.net/data/statistics.json');
    const statistics = response.data;
    const adapters = statistics.adapters;
    
    let report = [];

    let adapterArray=[];
    for (const [adapter, count] of Object.entries(adapters)) {
        //console.log(`adapter: ${adapter}, count: ${count}`);
        const entry = `${count.toString().padStart(10,'0')}:${adapter}`;
        adapterArray.push(entry);
    }
    adapterArray=adapterArray.sort().reverse();
    console.log (adapterArray.join('\n'));

    report.push(`- [ ] \` rank \` \` user \` \`adapter                       \``);
    report.push('');

    let rank = 0;
    let lastUser;

    for (let entry of adapterArray) {

        const user = entry.split(':')[0];
        const adapter = entry.split(':')[1];

        if (latestRepo[adapter]) {
            console.log( `[INFO] adapter ${adapter} (${user} user) not listed at repository`);
            continue;
        }

        rank=rank+1;

        let rankTxt = rank.toString().padStart(6, ' ');
        if (lastUser === user) {
            rankTxt = '      ';
        };
        lastUser = user;
        const userTxt = Number(user).toString().padStart(6, ' ');

        const line = `- [ ] \`${rankTxt}\` \`${userTxt}\` \`${adapter.padEnd(30,' ')}\``;
        report.push(line);
    }

    console.log(report.join('\n'));
    
}

async function main() {
    const options = {
        'dry': {
            type: 'boolean',
        },
        'debug': {
            type: 'boolean',
            short: 'd',
        },
    };

    const {
        values,
        positionals,
            } = parseArgs({ options, strict:true, allowPositionals:true,  });

    //console.log(values, positionals);

    opts.dry = values['dry'];
    opts.debug = values['debug'];

    await createTopList();

    console.log(`[INFO] task completed`);            
}

//process.env.OWN_GITHUB_TOKEN = process.env.IOBBOT_GITHUB_TOKEN;
main();
