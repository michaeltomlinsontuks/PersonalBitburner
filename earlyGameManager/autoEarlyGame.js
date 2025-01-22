/** @param {NS} ns **/
export async function main(ns) {
    const findServersScript = "findServers.js";
    const checkRootAccessScript = "checkRootAccess.js";
    const managerScript = "manager.js";
    const purchaseServersScript = "purchaseServers.js";

    // Step 1: Find Servers and Unlock Everything
    ns.run(findServersScript);
    await ns.sleep(20000); // Wait for 20 seconds to ensure the script completes

    ns.run(checkRootAccessScript);
    await ns.sleep(20000); // Wait for 20 seconds to ensure the script completes

    // Step 2: Start manager to assign basic to all servers
    ns.run(managerScript);
    await ns.sleep(10000); // Wait for 10 seconds to ensure the script completes

    // Main loop to handle continuous updates
    while (true) {
        // Step 3: Run purchaseServers every 10 seconds
        if (!ns.scriptRunning(purchaseServersScript, "home")) {
            ns.run(purchaseServersScript);
        }
        await ns.sleep(10000); // Wait for 10 seconds

        // Step 4: Assign basic through manager to all servers every minute
        if (!ns.scriptRunning(managerScript, "home")) {
            ns.run(managerScript);
        }
        await ns.sleep(50000); // Wait for 50 seconds

        // Step 5: Check if new servers are available with checkRootAccess every 2 minutes
        if (!ns.scriptRunning(checkRootAccessScript, "home")) {
            ns.run(checkRootAccessScript);
        }
        await ns.sleep(60000); // Wait for 1 minute
    }
}