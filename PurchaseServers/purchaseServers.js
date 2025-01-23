
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
            ns.write('AllServers.json', JSON.stringify([{ server: serverName, level: 0 }]), 'a');

            // Add server to rootedServers.json
            ns.write('rootedServers.json', JSON.stringify([{ server: serverName, ram: 8 }]), 'a');

            // Add server to purchasedServers.json
            ns.write('PurchasedServers.json', JSON.stringify([{ server: serverName, ram: 8 }]), 'a');
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
            // Update purchasedServers.json
            purchasedServers.forEach(s => {
                if(s.server == lowestRamServer){
                    s.ram = lowestRam * 2;
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
        }
    }
}