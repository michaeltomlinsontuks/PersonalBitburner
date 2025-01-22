/** @param {NS} ns **/
export async function earlyPickServer(ns, servers) {
    let bestTarget = null;
    let bestScore = -Infinity;
    const playerHackLevel = ns.getHackingLevel();

    for (const server of servers) {
        const maxMoney = ns.getServerMaxMoney(server);
        const currentMoney = ns.getServerMoneyAvailable(server);
        const minSecurity = ns.getServerMinSecurityLevel(server);
        const currentSecurity = ns.getServerSecurityLevel(server);
        const hackLevel = ns.getServerRequiredHackingLevel(server);

        // Aim for servers that are 50% of the player's hack level
        if (hackLevel > playerHackLevel * 0.5) {
            continue;
        }

        // Calculate the difference between max and current money, and min and current security
        const moneyDiff = maxMoney - currentMoney;
        const securityDiff = currentSecurity - minSecurity;

        // Calculate a score based on the server metrics
        const score = (maxMoney / currentSecurity) * (1 - (moneyDiff / maxMoney)) * (1 - (securityDiff / currentSecurity));

        if (score > bestScore) {
            bestScore = score;
            bestTarget = server;
        }
    }

    return bestTarget;
}