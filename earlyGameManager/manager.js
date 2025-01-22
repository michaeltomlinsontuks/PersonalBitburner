/** @param {NS} ns **/
export async function main(ns) {
    const rootAccessFile = "rootAccess.json";
    const basicScript = "basic.js";

    let serversWithRootAccess = [];

    // Load the servers with root access from the JSON file
    if (ns.fileExists(rootAccessFile)) {
        try {
            const fileContent = ns.read(rootAccessFile);
            serversWithRootAccess = JSON.parse(fileContent);
        } catch (error) {
            ns.tprint(`Error reading ${rootAccessFile}: ${error}`);
            return;
        }
    } else {
        ns.tprint(`File ${rootAccessFile} not found.`);
        return;
    }

    // Placeholder for the target picking function
    const bestTarget = await earlyPickServer(ns, serversWithRootAccess);

    if (bestTarget) {
        for (const server of serversWithRootAccess) {
            await sendOut(ns, server, bestTarget, basicScript);
        }
    } else {
        ns.tprint("No valid target found!");
    }
}

/** @param {NS} ns **/
export async function sendOut(ns, server, target, script) {
    const freeMemory = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const scriptRam = ns.getScriptRam(script);

    // Calculate the number of threads that can be run based on available memory
    const threads = Math.floor(freeMemory / scriptRam);

    if (threads > 0) {
        await ns.scp(script, server);
        ns.exec(script, server, threads, target);
    } else {
        ns.tprint(`Not enough memory to run the script on ${server}.`);
    }
}