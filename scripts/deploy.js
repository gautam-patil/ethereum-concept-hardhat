const { ethers, run, network } = require("hardhat");

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

    console.log("Deploying...");
    console.log(network.config)
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();

    console.log("Deploying at address ", simpleStorage.address)
    // console.log(network.config)
    if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.reteieve()
    console.log("currentValue ", currentValue.toString());

    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);

    const updateValue = await simpleStorage.reteieve();
    console.log("Update Value ", updateValue.toString())
}

async function verify(contractAddress, args) {

  //args for constructor

    console.log("Verify contract...");
    try{

      await run("verify:verify", {
          address: contractAddress,
          constructorArguments: args
      });
    }catch(e){
        if(e.message.toLowerCase().includes("already verified")){
            console.log("Already Verified");
        }else{

            console.log("Error", e)
        }
    }
}

main();