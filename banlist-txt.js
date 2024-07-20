const zomboidrcon = require("./rcon.js");

function applyBan(line) {
    return new Promise(async(resolve, reject) => {
        console.log("banning steam id: "+line);
        let response = await zomboidrcon.rconCommand('banid \"'+line+'\"');
        console.log("ban response: "+JSON.stringify(response));

        setTimeout(() => {
            return resolve(response);
        }, 1000)
    });
}

async function run() {
    console.log("running ban list");

    const fs = require('fs');
    const readline = require('readline');

    async function processLineByLine() {
        const fileStream = fs.createReadStream('banned.list');

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {

            if(line.startsWith("#")) {
                continue;
            } else {
                let banapply = await applyBan(line);
            }
        }
    }

    await processLineByLine();

}

run();

