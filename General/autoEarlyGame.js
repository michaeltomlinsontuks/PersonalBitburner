import * as fS from "ServerSearching/findServers.js";

export async function main(ns) {
    //run findServers on the home server to start the process
    await fS.findServers(ns, "home", "home", 0);
    //run checkRootAccess every 2 minutes to keep the process going
    while (true) {
        await ns.sleep(120000);
        await fS.checkRootAccess(ns);
    }

    //batch manager uses rootAccess to run scripts on all servers

    //run purchase servers every minute until all servers are purchased
    // - when all servers are purchased it will return true.
    // - all servers and ram will be stored in a json file
    //then run it every 5 minutes to keep upgrading servers
    let flag = false;
    while (!flag) {
        await ns.sleep(60000);
        await flag = pS.purchaseServers(ns, 0);
    }
    //upgrade servers
    while (true) {
        await ns.sleep(300000);
        await pS.purchaseServers(ns, 1);
    }

}