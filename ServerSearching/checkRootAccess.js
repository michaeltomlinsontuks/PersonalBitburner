export async function main (ns) {
//reads the AllServers.json file and stores it in the allServers variable
    let allServers = ns.read('AllServers.json');
    let rootedServers = [];
    let server = allServers[0];
    let i = 0;
    while(server!==allServers[allServers.length-1]){
        if (ns.hasRootAccess(server)) {
            rootedServers.push(server);
            i++;
        } else if(gainRootAccess(ns, server)){
            rootedServers.push(server);
            i++;
        } else{
            i++;
        }
    }
    ns.write('RootedServers.json', rootedServers);
}

export async function gainRootAccess(ns, server) {
    let i = 0;

    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        i++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(server);
        i++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(server);
        i++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(server);
        i++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(server);
        i++;
    }

    if (ns.getServerNumPortsRequired(server) > i) {
        return false;
    } else {
        ns.nuke(server);
        return true;
    }
}