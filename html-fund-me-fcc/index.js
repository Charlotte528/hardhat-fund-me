
import {ethers} from "./ethers.js"
import {abi, contractAddress} from "./constant.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log(ethers)
async function connect(){
    if (typeof window.ethereum !== "undefined"){
        await window.ethereum.request({method: "eth_requestAccounts"})
       connectButton.innerHTML = "Connected"
    } else{
        connectButton.innerHTML = "Please install Metamask!" 
    }
}

async function getBalance(){
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund(ethAmount){
    ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}... `)
    if (typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try{
    const transactionResponse = await contract.fund({value:ethers.utils.parseEther(ethAmount)})
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Done!")
    }catch(error){
        console.log(error)
    }}}

    async function withdraw(){
        if(typeof window.ethereum !== "undefined"){
            console.log("Withdrawing...")
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            try{
                const transactionResponse = await contract.withdraw()
                await listenForTransactionMine(transactionResponse,provider)
            }catch(error){
                console.log(error)
            }
        }
    }
   
    function listenForTransactionMine(transactionResponse, provider) {
        console.log(`Mining ${transactionResponse.hash}`)
        return new Promise((resolve, reject) => {
            try {
                provider.once(transactionResponse.hash, (transactionReceipt) => {
                    console.log(
                        `Completed with ${transactionReceipt.confirmations} confirmations. `
                    )
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })
    


}
