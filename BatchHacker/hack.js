export async function main(ns){
    const target = ns.args[0];
    while(true) {
        ns.hack(target);
    }
}