//calculates a total RAM for the network of rooted computers
// to determine how many threads can be run and which threads are run for each process
// This is run everytime the rootAccess.json file is updated
// Stores the total RAM in a json file
export async function ramCalc(ns) {
    let rootedServers = JSON.parse(ns.read('RootedServers.json') || '[]');
    let totalRam = 0;
    rootedServers.forEach(s => {
        totalRam += s.ram;
    });
    ns.write('TotalRam.json', JSON.stringify(totalRam), 'w');
    return totalRam;
}