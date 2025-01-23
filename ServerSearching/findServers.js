//this is the function that will run initially
import { gainRootAccess } from '/General/gainRootAccess.js';

export async function findServers(ns, server="home", originServer="home", level=0) {
    let accessableServers = ns.scan(server);
    // Remove origin server from list
    let index = accessableServers.indexOf(originServer);
    if (index > -1) {
        accessableServers.splice(index, 1);
    }
    // Store accessible servers into allServers.json with recursion level
    let allServers = JSON.parse(ns.read('AllServers.json') || '[]');
    accessableServers.forEach(s => {
        allServers.push({ server: s, level: level + 1 });
    });
    ns.write('AllServers.json', JSON.stringify(allServers), 'w');

    // Iterate over each server in accessibleServers
    for (const s of accessableServers) {
        // Gain root access on server
        if (await gainRootAccess(ns, s)) {
            // Add to rooted servers - rooted servers also store the ram of the server
            // Each server has a server name and a ram value
            let sRam = ns.getServerRam(s);
            let rootedServers = JSON.parse(ns.read('RootedServers.json') || '[]');
            rootedServers.push({ server: s, ram: sRam });
        }
        // Recursively find servers
        await findServers(ns, s, server, level + 1);
    }
}

//this is the function that be run every 2 minutes after the initial run, to keep searching/rooting servers - it needs to use allServers.json and rootedServers.json
//start by trying to find any new servers to add to allServers.json
// - need to figure out how to store which level of recursion we are on and only search servers that are 1 level deeper than the last run
// - maybe add a recursion level to the server object in allServers.json
//then try to root any servers that are not already rooted
export async function checkRootAccess(ns) {
    // Reads the AllServers.json file and stores it in the allServers variable
    // Need to find the highest level searched and only keep those servers, then search 1 level deeper on those servers
    let allServers = JSON.parse(ns.read('AllServers.json') || '[]');
    let maxLevel = 0;
    allServers.forEach(s => {
        if (s.level > maxLevel) {
            maxLevel = s.level;
        }
    });
    let newServers = [];
    allServers.forEach(s => {
        if (s.level === maxLevel) {
            newServers.push(s.server);
        }
    });
    // now run findServers on each of the new servers
    for (const s of newServers) {
        await findServers(ns, s, "home", maxLevel);
    }
    // need to reload allServers after adding new servers
    allServers = JSON.parse(ns.read('AllServers.json') || '[]');
    // now check if any servers need to be rooted
    let rootedServers = JSON.parse(ns.read('RootedServers.json') || '[]');
    let potentialRoots = allServers.filter(s => !rootedServers.includes(s.server));
    for (const s of potentialRoots) {
        if (await gainRootAccess(ns, s.server)) {
            let sRam = ns.getServerRam(s.server);
            rootedServers.push({ server: s.server, ram: sRam });
            ns.write('RootedServers.json', JSON.stringify(rootedServers), 'w');
        }
    }
}