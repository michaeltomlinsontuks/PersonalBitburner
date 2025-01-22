/** @param {NS} ns **/
export async function main(ns) {
    // Reads the AllServers.json file and stores it in the allServers variable
    let allServers = JSON.parse(ns.read('AllServers.json') || '[]');
    let rootedServers = [];
    let server;
    let i = 0;

    while (i < allServers.length) {
        server = allServers[i];
        if (ns.hasRootAccess(server)) {
            rootedServers.push(server);
        } else if (await gainRootAccess(ns, server)) {
            rootedServers.push(server);
        }
        i++;
    }

    ns.write('RootedServers.json', JSON.stringify(rootedServers), 'w');
}

/** @param {NS} ns **/
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