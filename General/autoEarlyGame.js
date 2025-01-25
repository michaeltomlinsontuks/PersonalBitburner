import * as fS from "findServers.js";
import * as pS from "purchaseServers.js";
import * as tP from "earlyPickServer.js";
import * as sA from "scriptAssigner.js";

export async function main(ns) {
    // Run findServers on the home server to start the process
    await fS.findServers(ns, "home", "home", 0);

    // Send out scripts to all servers
    let target = await tP.earlyPickServer(ns);
    await sA.assignScripts(ns, target, "basic.js");

    // Function to check root access
    async function checkRootAccess() {
        await fS.checkRootAccess(ns);
    }

    // Function to purchase servers
    async function purchaseServers(flag = false) {
        if(!flag) {
            flag = await pS.purchaseServers(ns, 0);
            return false;
        }else{
            await pS.purchaseServers(ns, 1);
        }
    }

    // Function to calculate the best target
    async function calculateBestTarget() {
        return await tP.earlyPickServer(ns);
    }

    // Function to send out scripts
    async function assignScripts(target) {
        await sA.aasignScripts(ns, target, "basic.js");
    }

    let i = 0;
    let currentTarget = target;
    // Maintenance loop
    while (true) {
        i++;
        await checkRootAccess();
        await purchaseServers();
        if(i%5 == 0) {
            target = await calculateBestTarget();
            if(target != currentTarget) {
                currentTarget = target;
                await assignScripts(target);
            }
        }
        await ns.sleep(60000); // Run the maintenance loop every minute
    }
}