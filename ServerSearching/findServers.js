//Recursive Server Searching
//This function will search for servers in the network and store all servers found in AllServers.json


export async function findServers(ns){
    let allServers = ns.read('AllServers.json');
    let currentServers = ns.scan('home');
    for (let i = 0; i < currentServers.length; i++){
        if (allServers.indexOf(currentServers[i]) === -1){
            allServers.push(currentServers[i]);
            ns.write('AllServers.json', allServers);
            await findServers(ns);
        }
    }
}

export async function main(ns){
    let allServers = [];
    ns.write('AllServers.json', allServers);
    await findServers(ns);
    ns.tprint('All Servers Found');
}

