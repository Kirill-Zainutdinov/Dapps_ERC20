<template>
    <div class="elem">
        <div>
            <my-input 
                v-if="(inputText.length > 0)"
                v-for="id in inputText.length"
                :inputText=inputText[id-1]
                :argId=id-1
                :clear="clearInput"
                @input="inputArgument"
                @clear="stopClear"
            />
        </div>
        <button class="btn" @click="handler">Вызов функции контракта <strong>{{buttonText}}</strong></button>
        <div :id="buttonText" class="field hide">
            <span
                v-if="(readOnly === true)"
                class="ans"
            >
                Результат: {{result}}
            </span>
            <a
                v-else
                class="ref"
                target="_blank"
                v-bind:href="result"
            > 
                Посмотреть транзакцию на Etherscan
            </a>
        </div>
    </div>
</template>

<script>
import {  mapState } from "vuex"
export default{
    name: "call-function",
    data(){
    return {
        result: "",
        args: [],
        clearInput: false
    }
    },
    computed:{
        ...mapState({
            chain: state => state.wallet.chain,
            erc20Address: state => state.erc20Address
        })
    },
    props:{
        buttonText:{
            type: String,
            required: true
        },
        buttonHandler:{
            type: Function,
            required: true
        },
        inputText:{
            type: Array,
            default: []
        },
        readOnly:{
            type: Boolean,
            default: true
        }
    },
    methods:{
        inputArgument(eventdata){
            this.args[eventdata.argId] = eventdata.arg
        },
        async handler(){
            if(this.erc20Address == "" && this.buttonText != "constructor(string name, string symbol, uint256 decimals)"){
                alert("Сначала задеплойте контракт или подключитесь к уже задеплоиному контракту")
            }
            else{
                if(this.inputText.length != this.args.length){
                    alert("Необходимо ввести аргументы!")
                }
                else{
                    if(this.readOnly){
                    this.result = await this.$props.buttonHandler(this.args)
                    }
                    else{
                        this.result = "https://"
                        if(this.chain !== "main"){
                            this.result += this.chain + "."
                        }
                        this.result += "etherscan.io/tx/" + await this.$props.buttonHandler(this.args)
                    }
                    if(document.getElementById(this.buttonText).classList.contains("hide")){
                        document.getElementById(this.buttonText).classList.remove("hide")
                    }
                    if(this.args.length > 0){
                        this.clearInput = true
                    }
                }
            }
        },
        stopClear(){
            this.clearInput = false
        }
    },
    watch:{
        erc20Address(){
            if(!document.getElementById(this.buttonText).classList.contains("hide")){
                document.getElementById(this.buttonText).classList.add("hide")
            }
        }
    }
}
</script>


<style>
.field{
    margin-top: 5px;
    padding: 10px 0px;
}
.hide{
    visibility: hidden;
    display: inline;
}
.ref{
    text-decoration: none;
    padding: 10px 15px;
    background: none;
    color: black;
    border: 2px solid darkgreen;
    margin-top: 5px;
}
.ref:hover{
    border: 2px solid lightgreen;
}
.ref:active{
    color: darkgray;
}
</style>

