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