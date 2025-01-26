export async function threadCalc(ns, script) {
    let rootedServers = JSON.parse(ns.read('RootedServers.json') || '[]');
    const scriptRam = ns.getScriptRam(script);
    let threads = 0;
    rootedServers.forEach(s => {
        threads += Math.floor(s.ram / scriptRam);
    });
    return threads;
}
