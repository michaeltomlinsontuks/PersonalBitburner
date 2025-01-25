export async function threadCalc(ns, script) {
    const scriptRam = ns.getScriptRam(script);
    const totalRam = ns.read('TotalRam.json');
    let threads = Math.floor(totalRam / scriptRam);
    return threads;
}