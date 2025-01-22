/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];  // The target server passed as an argument
    const moneyThresh = ns.getServerMaxMoney(target) * 0.9;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}