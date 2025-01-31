//considers max money, min security,
//current money, current security,
//required hacking level, player hacking level
//player hacking multipliers
import {threadCalc} from "threadCalc.js";

export async function printServerStats(ns, target) {
    const server = ns.getServer(target);

    //Hack
    const hackChance = ns.hackAnalyzeChance(target);
    const hackAnalyze = ns.hackAnalyze(target);
    const hackAnalyzeSecurity = ns.hackAnalyzeSecurity(1, target);
    const hackAnalyzeThreads = ns.hackAnalyzeThreads(target, server.moneyAvailable);
    const hackTime = ns.getHackTime(target);
    const hackRequiredLevel = ns.getServerRequiredHackingLevel(target);

    //Grow
    const growTime = ns.getGrowTime(target);
    const growAnalyze = ns.growthAnalyze(target, 2);
    const growAnalyzeSecurity = ns.growthAnalyzeSecurity(1, target);
    const growAnalyzeThreads = ns.growthAnalyzeThreads(target, server.moneyAvailable);
    const maxMoney = ns.getServerMaxMoney(target);
    const moneyAvailable = server.moneyAvailable;
    const serverGrowth = server.serverGrowth;

    //Weaken
    const weakenTime = ns.getWeakenTime(target);
    const weakenAnalyze = ns.weakenAnalyze(1);
    const minSecurity = server.minDifficulty;
    const security = server.hackDifficulty;
    const baseSecurity = server.baseDifficulty;

    const threads = threadCalc(ns, "basic.js");
    //Key Metrics
    //Time to Prep
        //Lowest Security Level
        //Max Money
    //Time to Hack
    //Money Benefit

}

export async function pickServer(ns, target) {

}

export async function timeToPrep(ns, target) {
    //time to weaken to minimum security
    //time to grow to max money
    //total time to prep - need to adjust for the increase in security from growing

    const weakenTime = ns.getWeakenTime(target);
    const weakenAnalyze = ns.weakenAnalyze(1);
    const minSecurity = server.minDifficulty;
    const security = server.hackDifficulty;
    const baseSecurity = server.baseDifficulty;
}