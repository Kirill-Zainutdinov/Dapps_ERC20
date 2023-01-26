import {createStore} from 'vuex'
import {ABI} from "../../contract/ERC20.abi.js"
import {bytecode} from "../../contract/ERC20.bin.js"
const Web3 = require('web3')


export default createStore({
    state:{
        web3Wallet: {},
        wallet: {
            address: "",
            chainId: "",
            chain: ""
        },
        erc20: {},
        erc20Address: ""
    },
    getters:{
    },
    mutations:{
    },
    actions:{
        async connectWallet({state}){
            // проверка, что в браузере установлен клиент эфириума
            if (typeof window.ethereum !== 'undefined') {
                console.log("Ethereum client installed!")
                // проверка, то клиент эфириума - это метамаск
                if(ethereum.isMetaMask === true)
                {
                    console.log("Metamask installed!")
                    if(ethereum.isConnected() != true){
                        console.log("Metamask is not connected!")
                        // не подключён - подклчистя
                        await ethereum.enable();
                        console.log("Metamask connected!")
                    }
                    else{
                        console.log("Metamask connected!")
                    }
                    // получене аккаунтов
                    // метод возвращает массив
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
                    // но на данный момент, доступен только первый аккаунт из массива
                    state.wallet.address = accounts[0]

                    // подключаем провайдер через метамаск
                    state.web3Wallet = new Web3(ethereum)
                    // получаем id и имя цепочки
                    state.wallet.chainId = await state.web3Wallet.eth.net.getId()
                    state.wallet.chain = await state.web3Wallet.eth.net.getNetworkType()

                    // подписываемся на изменение аккаунта
                    ethereum.on('accountsChanged', (accounts) => {
                        state.wallet.address = accounts[0]
                        console.log(`accounts changed to ${state.wallet.address }`)
                    })

                    // подписываемся на цепочки
                    ethereum.on('chainChanged', (chainId) => {
                        console.log(`chainId changed to ${chainId}`)
                        // если поменяли цепочку, то перезагружаем страницу
                        window.location.reload()
                    })

                }
                else{
                    alert('MetaMask is not installed!')
                }
            }
            else{
                alert('Ethereum client is not installed!')
            }
        },
        // деплой нового контракта токена
        async deploErc20({state}, arg) {
            const [name, symbol, decimals] = arg

            state.erc20 = new state.web3Wallet.eth.Contract(ABI)
            
            let deployCode = state.erc20.deploy({
                data: bytecode,
                arguments: [name, symbol, decimals]
            }).encodeABI()
        
            let txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.wallet.address,
                    data: deployCode
                }]
            })

            let subscription = state.web3Wallet.eth.subscribe('newBlockHeaders')
            .on("connected", function(subscriptionId){
                console.log(`Successfully subscribed, id: ${subscriptionId}`)
            })
            .on("data", async function(blockHeader){
                const transactions = (await state.web3Wallet.eth.getBlock(blockHeader.number, true)).transactions
                const length = transactions.length
                for(let index = 0; index < length; index++){
                    if(transactions[index].hash === txHash){
                        await state.web3Wallet.eth.getTransactionReceipt(txHash)
                        .then(receipt => {
                            state.erc20Address = receipt.contractAddress
                            state.erc20 = new state.web3Wallet.eth.Contract(ABI, state.erc20Address)
                            subscription.unsubscribe(function(error, success){
                                if(error){
                                    console.log(error)
                                }
                                if(success)
                                    console.log('Successfully unsubscribed!')
                            })
                        })
                    }
                }
            })
            .on("error", (error) => console.log(error))

            return txHash
        },
        // подключение к уже задеплоиному контракту токена
        connectToErc20({state}, newErc20Address){
            state.erc20Address = newErc20Address
            state.erc20 = new state.web3Wallet.eth.Contract(ABI, state.erc20Address)
        },
        async mint({state}, arg){
            const [to, value] = arg

            let txData = state.erc20.methods.mint(to, value).encodeABI()

            return await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.wallet.address,
                    to: state.erc20Address,
                    data: txData
                }]
            })
        },
        async approve({state}, arg){
            const [spender, value] = arg

            let txData = state.erc20.methods.approve(spender, value).encodeABI()

            return await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.wallet.address,
                    to: state.erc20Address,
                    data: txData
                }]
            })
        },
        async transfer({state}, arg){
            const [to, value] = arg

            let txData = state.erc20.methods.transfer(to, value).encodeABI()

            return await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.wallet.address,
                    to: state.erc20Address,
                    data: txData
                }]
            })
        },
        async transferFrom({state}, arg){
            const [from, to, value] = arg

            let txData = state.erc20.methods.transferFrom(from, to, value).encodeABI()

            return await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.wallet.address,
                    to: state.erc20Address,
                    data: txData
                }]
            })
        },
        async getName({state}) {
            return await state.erc20.methods.name().call({from: state.wallet.address}, (error, result) => {
                if(error) console.log(error)
                else {
                    return result
                }
            })
        },
        async getSymbol({state}){
            return await state.erc20.methods.symbol().call({from: state.wallet.address}, (error, result) => {
                if(error) console.log(error)
                else {
                    return result
                }
            })
        },
        async getDecimals({state}){
            return await state.erc20.methods.decimals().call({from: state.wallet.address}, (error, result) => {
                if(error) console.log(error)
                else {
                    return result
                }
            })
        },
        async getTotalSupply({state}){
            return await state.erc20.methods.totalSupply().call({from: state.wallet.address}, (error, result) => {
                if(error) console.log(error)
                else {
                    return result
                }
            })
        },
        async balanceOf({state}, arg){
            const account = arg[0]
            return await state.erc20.methods.balanceOf(account).call({from: state.wallet.address}, (error, result) => {
                if(error) console.log(error)
                else {
                    return result
                }
            })
        },
        async allowance({state}, arg){
            const [owner, spender] = arg
            return await state.erc20.methods.allowance(owner, spender).call({from: state.wallet.address}, (error, result) => {
                if(error) console.log(error)
                else {
                    return result
                }
            })
        },
    },
    modules:{
    } 
})

