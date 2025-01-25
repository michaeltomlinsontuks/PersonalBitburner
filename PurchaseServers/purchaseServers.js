
//when called on the function will be told if it is buying or upgrading servers
//bought servers will be added to the allServers.json file - level 0
//bought servers will be added to the rootedServers.json file
//bought servers will be added to the purchasedServers.json file - with their current ram

export async function purchaseServers(ns, state) {
    //numServers is the number of servers in the purchasedServers.json file
    let purchasedServers = JSON.parse(ns.read('PurchasedServers.json') || '[]');
    let numServers = purchasedServers.length;

    // Buying State = 0
    if(state == 0){
        // Buy as many 8GB servers as possible
        while(ns.getPurchasedServerCost(8) <= ns.getServerMoneyAvailable('home') && numServers < 25){
            // Purchase server
            // pserv-numServers = server name
            let serverName = 'pserv-' + numServers;
            ns.purchaseServer(serverName, 8);
            // Add server to allServers.json
            let allServers = JSON.parse(ns.read('AllServers.json') || '[]');
            allServers.push({ server: serverName, level: 0 });
            ns.write('AllServers.json', JSON.stringify(allServers), 'w');

            // Add server to RootedServers.json
            let rootedServers = JSON.parse(ns.read('RootedServers.json') || '[]');
            rootedServers.push({ server: serverName, ram: 8 });
            ns.write('RootedServers.json', JSON.stringify(rootedServers), 'w');

            // Add server to purchasedServers.json
            purchasedServers.push({ server: serverName, ram: 8 });
            ns.write('PurchasedServers.json', JSON.stringify(purchasedServers), 'w');
            numServers++;
        }
        return numServers == 25;
    }
    // Upgrading State = 1
    else if (state == 1){
        //Find the lowest ram server and upgrade it - continue until out of money
        //Upgrading includes:
            //killing all running scripts on the server
            //deleting the server
            //purchasing a new server with double the ram
            //updating the ram in the purchasedServers.json file
            //updating the ram in the rootedServers.json file
        purchasedServers = JSON.parse(ns.read('PurchasedServers.json') || '[]');
        let lowestRam = 8;
        let lowestRamServer = '';
        purchasedServers.forEach(s => {
            if(s.ram < lowestRam){
                lowestRam = s.ram;
                lowestRamServer = s.server;
            }
        });
        while(ns.getPurchasedServerCost(lowestRam * 2) <= ns.getServerMoneyAvailable('home')){
            // Kill all scripts
            ns.killall(lowestRamServer);
            // Delete server
            ns.deleteServer(lowestRamServer);
            // Purchase server
            ns.purchaseServer(lowestRamServer, lowestRam * 2);
            scriptAssignServer(ns, await earlyPickServer(ns), "basic.js", lowestRamServer);
            // Update purchasedServers.json - while looping through find the new lowestRamServer
            let nextLowestRamServer = '';
            let nextLowestRam = lowestRam * 2;
            purchasedServers.forEach(s => {
                if(s.server == lowestRamServer){
                    s.ram = lowestRam * 2;
                }
                if(s.ram < nextLowestRam){
                    nextLowestRam = s.ram;
                    nextLowestRamServer = s.server;
                }
            });
            //update purchasedServers.json
            ns.write('PurchasedServers.json', JSON.stringify(purchasedServers), 'w');
            //update rootedServers.json
            let rootedServers = JSON.parse(ns.read('RootedServers.json') || '[]');
            rootedServers.forEach(s => {
                if(s.server == lowestRamServer){
                    s.ram = lowestRam * 2;
                }
            });
            ns.write('RootedServers.json', JSON.stringify(rootedServers), 'w');
            //update lowestRamServer
            lowestRam = nextLowestRam;
            lowestRamServer = nextLowestRamServer;
        }
    }
}

export async function main(ns) {
    let flag = false;
    while(!flag){
        flag = await purchaseServers(ns, 0);
        await ns.sleep(60000);
    }
    while (true) {
        await purchaseServers(ns, 1);
        await ns.sleep(60000);
    }
}