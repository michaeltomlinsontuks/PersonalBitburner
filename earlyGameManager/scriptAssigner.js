//assigns scripts to all servers in RootedServers.json
//takes in a target server and a script to run
//uses the sendOut function from sendOut.js
import * as sO from "sendOut.js";
export async function assignScripts(ns, target, script){
    let servers = JSON.parse(ns.read('RootedServers.json') || '[]');
    servers.forEach(s => {
    ns.killall(s.server);
    sO.sendOutAll(ns, s.server, s.ram, script, ns.getScriptRam(script, "home"));
    });
}

export async function scriptAssignServer(ns, target, script, server){
    let servers = JSON.parse(ns.read('RootedServers.json') || '[]');
    servers.forEach(s => {
        if(s.server == server){
            sO.sendOutAll(ns, s.server, s.ram, script, ns.getScriptRam(script, "home"));
        }
    });
}

