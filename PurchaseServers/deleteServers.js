export async function deleteServers(ns) {
    const servers = ns.getPurchasedServers();
    for (let i = 0; i < servers.length; i++) {
        ns.deleteServer(servers[i]);
    }
}

export async function main(ns) {
    await deleteServers(ns);
}