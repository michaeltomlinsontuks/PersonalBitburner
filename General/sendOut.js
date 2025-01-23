//sends out and executes a script on a server
export async function sendOutAll(ns, server, script) {
    ns.killall(server);
    // Calculates Script Ram and Server Ram and Executes as many threads of the script as possible
    ns.scp(script, server);
    let scriptRam = ns.getScriptRam(script);
    let serverRam = ns.getServerRam(server)[0];
    let threads = Math.floor(serverRam / scriptRam);
    ns.exec(script, server, threads);
}

export async function sendOut(ns, server, script) {
    ns.scp(script, server);
    ns.exec(script, server);
}