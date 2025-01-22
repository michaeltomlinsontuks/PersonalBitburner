/** @param {NS} ns **/
export async function findServers(ns, server = 'home') {
    let allServers = JSON.parse(ns.read('AllServers.json') || '[]');
    let currentServers = ns.scan(server);
    for (let i = 0; i < currentServers.length; i++) {
        if (allServers.indexOf(currentServers[i]) === -1) {
            allServers.push(currentServers[i]);
            ns.write('AllServers.json', JSON.stringify(allServers), 'w');
            await findServers(ns, currentServers[i]);
        }
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    let allServers = [];
    ns.write('AllServers.json', JSON.stringify(allServers), 'w');
    await findServers(ns);
    ns.tprint('All Servers Found');
}