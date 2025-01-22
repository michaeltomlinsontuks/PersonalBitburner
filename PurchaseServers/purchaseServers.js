/** @param {NS} ns **/
export async function main(ns) {
    const maxServers = 25;
    let serverCount = ns.getPurchasedServers().length;
    let state = serverCount < maxServers ? "buying" : "upgrading";
    let ramSize = 8; // Starting RAM size for new servers

    // Helper function to check if you can afford a server with the current RAM size
    function canAffordServer(ramSize) {
        return ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ramSize);
    }

    // Helper function to check if you can afford upgrading a server with the next RAM size
    function canAffordUpgrade(ramSize) {
        return ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ramSize * 2);
    }

    // Main loop
    while (true) {
        if (state === "buying") {
            // Handle buying servers state
            if (serverCount < maxServers && canAffordServer(ramSize)) {
                // Purchase a new server
                let serverName = `pserv-${serverCount}`;
                ns.purchaseServer(serverName, ramSize);
                ns.tprint(`Purchased server: ${serverName}`);
                await ns.exec("findServers.js", "home");
                await ns.exec("checkRootAccess.js", "home");
                await ns.exec("manager.js", "home");
                serverCount++;
            }

            // If we've bought all 25 servers, switch to upgrading state
            if (serverCount === maxServers) {
                state = "upgrading";
                ns.tprint("All servers purchased, switching to upgrading state...");
            }
        } else if (state === "upgrading") {
            // Handle upgrading servers state
            let allUpgraded = true;
            for (let i = 0; i < maxServers; i++) {
                let serverName = `pserv-${i}`;
                if (ns.serverExists(serverName)) {
                    const currentRam = ns.getServerMaxRam(serverName);
                    if (currentRam < ramSize * 2) {
                        allUpgraded = false;
                        if (canAffordUpgrade(ramSize)) {
                            ns.killall(serverName);
                            ns.deleteServer(serverName);
                            ns.purchaseServer(serverName, ramSize * 2); // Upgrade to double RAM
                            await ns.exec("manager.js", "home");
                            ns.tprint(`Upgraded server: ${serverName} to ${ramSize * 2} GB RAM`);
                        } else {
                            ns.tprint(`Cannot afford upgrade for ${serverName}, waiting for funds...`);
                            await ns.sleep(20000);  // Wait 20 seconds before retrying
                            break; // Exit the loop temporarily to check the condition again
                        }
                    }
                }
            }

            if (allUpgraded) {
                ramSize *= 2; // Double the RAM size for the next round
                ns.tprint(`All servers upgraded to ${ramSize} GB, preparing for next upgrade...`);
            }
        }

        await ns.sleep(1000); // Wait for 1 second before checking again
    }
}