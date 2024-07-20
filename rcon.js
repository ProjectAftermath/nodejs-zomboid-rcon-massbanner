const config = require("./config.json");
const os = require('os');
const shell = require("shelljs");
const isWindows = os.platform() === 'win32';
const exePath = isWindows ? process.cwd()+"\\rcon\\rcon.exe" : "/home/pzuser/rconcmd/rcon/rcon";
const Rcon = require("rcon");

/**
 * generic rcon command
 * @param command
 * @returns {Promise<unknown>}
 */
function rconCommand(command) {
    return new Promise((resolve, reject) => {

        var options = {
            tcp: true,       // false for UDP, true for TCP (default true)
            challenge: false  // true to use the challenge protocol (default true)
        };

        let address = config.address;

        let addrParts = address.split(":");

        let rcon = new Rcon(addrParts[0], addrParts[1], config["rcon-password"], options);

        rcon.connect();

        rcon.on("auth", () => {
            rcon.send(command);
            rcon.disconnect();

            return resolve(true);
        });

        rcon.on("response", (str) =>{
            console.log(str);
        });


        rcon.on("error", (errpr) => {
            console.log(errpr);
            try {
                rcon.disconnect();
            } catch (e) {
                console.log(e);
            }

            return resolve(false);
        });
    });
}

function serverMsg(msg) {
    return new Promise((resolve, reject) => {

        var options = {
            tcp: true,       // false for UDP, true for TCP (default true)
            challenge: false  // true to use the challenge protocol (default true)
        };

        let address = config.address;

        let addrParts = address.split(":");

        let rcon = new Rcon(addrParts[0], addrParts[1], config["rcon-password"], options);

        rcon.connect();

        rcon.on("auth", () => {

            rcon.send("servermsg \""+msg.toString()+"\"");
            rcon.disconnect();

            return resolve(true);
        });


        rcon.on("error", () => {
            try {
                rcon.disconnect();
            } catch (e) {
            }

            return resolve(false);
        });
    });
}

function setAdmin(user) {
    return rconCommand("setaccesslevel \""+user+"\" \"admin\"");
}

function setPlayer(user) {
    return rconCommand("setaccesslevel \""+user+"\" \"player\"");
}

function quit() {
    return rconCommand("quit");
}

module.exports = {
    rconCommand: rconCommand,
    serverMsg: serverMsg,
    setAdmin: setAdmin,
    setPlayer: setPlayer,
    quit: quit
};