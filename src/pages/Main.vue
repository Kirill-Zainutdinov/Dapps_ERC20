<template>
      <div class="mainElem">
      <h3>
        Информация о приложении
      </h3>
      <div class="elem">
        <p>Данное приложение предназначено для удобной работы с токенами стандарта ERC20</p>
        <p>1. Подключите Metamask</p>
        <p>
          2. Задеплойте новый токен ERC20 или подключитесь к уже задеплоиному токену по адресу контракта 
          (например <a href="https://goerli.etherscan.io/address/0x947c1567b4c7fcec0097e33aa1a12e7b9fd240e8#code">0x947c1567b4c7fcEC0097E33aA1A12E7b9Fd240E8</a>)
        </p>
        <p>3. Работайте с функциями токена через удобный интерфейс</p>
      </div>
    </div>

    <div class="mainElem">
      <h3>
        Подключение Metamask
      </h3>
      <div class="elem">
        <button class="btn" @click="connectWallet">Подключить метамаск</button>
        <div class="ans">Адрес аккаунта: {{$store.state.wallet.address}}</div>
        <div class="ans">Имя цепи: {{$store.state.wallet.chain}}</div>
        <div class="ans">Id цепи: {{$store.state.wallet.chainId}}</div>
      </div>
    </div>

    <div class="mainElem">
      <h3>
        Задеплоить новый контракт токена ERC20
      </h3>
      <call-function
        buttonText="constructor(string name, string symbol, uint256 decimals)"
        :buttonHandler="deploErc20"
        :inputText="['name', 'symbol', 'decimals']"
        :readOnly="false"
      >
      </call-function>
    </div>

    <div class="mainElem">
      <h3>
        Подключиться к существующему контракту токена ERC20
      </h3>
      <div class="elem">
        <div>
        <input class="input" v-model="erc20Address" placeholder="Введите адрес контракта">
        </div>
        <button class="btn" @click="handler">Подключится к контракту</button>
      </div>

    </div>

    <div class="mainElem">
      <h3>
        Текущий контракт:
      </h3>
      <div class="elem">
        <div class="ans">Адрес контракта: {{$store.state.erc20Address}}</div>
        <div class="ans">Id цепи: {{$store.state.wallet.chainId}}</div> 
      </div>
    </div>

    <div class="mainElem">
      <h3>
        Вызов платных функций контракта
      </h3>

      <call-function
        buttonText="mint(address to, uint256 value)"
        :buttonHandler="mint"
        :inputText="['to', 'value']"
        :readOnly="false"
      >
      </call-function>

      <call-function
        buttonText="approve(address spender, uint256 value)"
        :buttonHandler="approve"
        :inputText="['spender', 'value']"
        :readOnly="false"
      >
      </call-function>

      <call-function
        buttonText="transfer(address to, uint256 value)"
        :buttonHandler="transfer"
        :inputText="['to', 'value']"
        :readOnly="false"
      >
      </call-function>

      <call-function
        buttonText="transferFrom(address from, address to, uint256 value)"
        :buttonHandler="transferFrom"
        :inputText="['from', 'to', 'value']"
        :readOnly="false"
      >
      </call-function>
    </div>

    <div class="mainElem">
      <h3>
        Вызов бесплатных функций контракта
      </h3>
      <call-function
        buttonText="name()"
        :buttonHandler="getName"
      >
      </call-function>

      <call-function
        buttonText="symbol()"
        :buttonHandler="getSymbol"
      >
      </call-function>

      <call-function
        buttonText="decimals()"
        :buttonHandler="getDecimals"
      >
      </call-function>

      <call-function
        buttonText="totalSupply()"
        :buttonHandler="getTotalSupply"
      >
      </call-function>

      <call-function
        buttonText="balanceOf(address account)"
        :buttonHandler="balanceOf"
        :inputText="['account']"
      >
      </call-function>

      <call-function
        buttonText="allowance(address owner, address spender)"
        :buttonHandler="allowance"
        :inputText="['owner', 'spender']"
      >
      </call-function>
    </div>
</template>

<script>
import { mapActions } from "vuex"
export default{
  data(){
    return{
      erc20Address: "",
    }
  },
  methods:{
    ...mapActions({
        connectWallet: 'connectWallet',
        deploErc20: 'deploErc20',
        connectToErc20: 'connectToErc20',
        mint: 'mint',
        approve: 'approve',
        transfer: 'transfer',
        transferFrom: 'transferFrom',
        getName: 'getName',
        getSymbol: 'getSymbol',
        getDecimals: 'getDecimals',
        getTotalSupply: 'getTotalSupply',
        balanceOf: 'balanceOf',
        allowance: 'allowance',
    }),
    handler(){
      this.connectToErc20(this.erc20Address)
      this.erc20Address = ""
    }
  }
}
</script>


<style>
h3{
  text-align: center;
  margin: 5px 0px 10px;
}
.mainElem{
    padding: 15px;
    border: 1px solid grey;
    margin-bottom: 30px;
}
.elem{
    padding: 15px;
    border: 1px solid lightgray;
    margin-top: 15px;
}
.input{
    width: 350px;
    margin-bottom: 5px;
    padding: 10px 15px
}
.btn{
    padding: 10px 15px;
    background: lightskyblue;
    color: black;
    border: 2px solid black;
}
.btn:hover{
  background: lightsteelblue;
}
.btn:active{
  color: white;
}
.ans{
    padding: 10px 15px;
    background: none;
    color: black;
    border: 2px solid darkgreen;
    margin-top: 5px;
}
</style>

