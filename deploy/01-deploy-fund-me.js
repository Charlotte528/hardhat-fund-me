// function deployFunc(){
//     console.log("Hi!")
// }

// module.exports.default = deployFunc;

const {networkConfig, developmentChains} = require ("../helper-hardhat-config.js");
const{network} = require("hardhat")
const{verify} = require("../utils/verify")
// const helperConfig = require("../helper-hardhat-config.js")
// const networkConfig = helperConfig.networkConfig


module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }



    const fundMe = await deploy("FundMe",{
        from:deployer,
        args:[ethUsdPriceFeedAddress],//put price feed
        log:true,
        waitConfirmations:network.config.blockConfirmations || 1,
    })
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
       await verify(fundMe.address,[ethUsdPriceFeedAddress])
    }
    log("--------------------------------------")
    
}
    module.exports.tags = ["all","FundMe"]