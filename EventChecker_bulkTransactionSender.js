#!/usr/bin/nodejs

var mysql = require('mysql');
const util = require('util');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var Contract = require('web3-eth-contract');
var CronJob = require('cron').CronJob;
var CHAIN = {
    'chain': 'goerli'
};

// TEST GoErli BRIDGE COntract ADDRESS - 0xaD0cBc91eB7dF2682c12EE49ddd8E3f1509e6613
// TEST Goerli Token Address DRAGON - 0xd3892389Fdd6c5CE95FafCE97609795a75dB7B63
const MIN_BNB = 1000000000;

const options = {
    timeout: 90000,
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 20,
        onTimeout: true,
    },
    clientConfig: {
        keepalive: true,
        keepaliveInterval: 120000,
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
};

var CONTRACT_ADDR_ABI = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"outputCurrency","type":"address"}],"name":"CoinIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"outputCurrency","type":"address"}],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]');
let web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/cd3baceab3f747fc837269aadc015515', options));    

async function checkLatestBlock() {    
    // Event Fetcher wallet  - 0x0ea43bE54047f1b9c047b44e47E0b9052dA0078f
    var toblock = await web3.eth.getBlockNumber();
    var fromblock = toblock - 1500;
    console.log(">>TESTING FOR>>toblock>>,fromblock>>", toblock, fromblock);

    fromblock = 7721320;
    toblock = 7721330;
    getEventData_TokenIn(fromblock, toblock);    // Goerli testing ...    
    // 26 JULY 2022 CoinIn -> CoinOut
    // getEventData_CoinIn(fromblock, toblock);
}


checkLatestBlock();


async function getEventData_TokenIn(_fromBlock, _toBlock) {
    console.log(">>> in TokenIn  function fromblock, toblock>>>",_fromBlock, _toBlock);
    const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, "0xaD0cBc91eB7dF2682c12EE49ddd8E3f1509e6613");
    await myinstance.getPastEvents('TokenIn', {    
        fromBlock: _fromBlock,
        toBlock: _toBlock
    }, function(error, myevents) {
        console.log("EVENTS >>>>",myevents);		 		  	     	   
        if (myevents === undefined) {
            return
        }
        var myeventlen = myevents.length;
        process.env.TokenInEventLen = myevents.length;
        console.log("=================================================");
        console.log("TOKEN IN >>> myeventlen >>>>", myeventlen);
        console.log("=================================================");
        var secretText = Math.random(23439, 5654624);
        process.env.secretText = secretText.toString();
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));    
        (async ()=>{
            for (var k = 0; k < myeventlen; k++) {            
                await wait(3500);
                var myeve = myevents[k];
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("Event Detail ::: >>>", myeve.event, myeve.blockNumber, myeve.returnValues.tokenAddress.trim());
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                //console.log("~~~~~~~~~~~~~~~~~~~>>> k, myeve >>>",k, myeve);							
                var _myblkNumber = myeve.blockNumber;
                var _myorderid = myeve.returnValues.orderID;
                var _mytokenAddress = myeve.returnValues.tokenAddress.trim();
                var _mysendcoinsTo = myeve.returnValues.user;
                var _myamount = myeve.returnValues.value;
                var _mychainid = myeve.returnValues.chainID;
                //////////////////							
                var _check = false;

                // If chainid not coming proper from UI overwrite it!!	 
                if (_mytokenAddress === "0xd3892389Fdd6c5CE95FafCE97609795a75dB7B63") {
                    _mychainid = 5;
                    _check = true;
                }
                /////////////////
                //console.log(">>>>>### TokenIn eventlen, k, id, Order Id >>>>",myeventlen, k, _mychainid, _myorderid);
                if ((_mychainid) && (parseInt(_myamount)) && (_check)) {
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                    console.log("!!!!!! tokenAddress >>>>>", _mytokenAddress);
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                    var _ary = ["0xd3892389Fdd6c5CE95FafCE97609795a75dB7B63"];
                    if (_ary.includes(_mytokenAddress)) {
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("<<<<@>>>> Looking for ---->>>>", _mytokenAddress);
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        try {
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                            console.log("~~~~~TokenIn EVENT >>>>_mytokenAddress ~~~~~", _mytokenAddress);
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                            (async () => {
                                var cnt = await db_select(_mychainid, _myorderid, _mysendcoinsTo, _myamount, _mytokenAddress, secretText).catch(console.log);
                            })();
                        } catch (e) {
                            console.log(">>>>>Catch >>>>", e);
                        }
                    } else {
                        console.log(">>>> not matched !!");
                    }
                } else {
                    console.log(">>> TOKENIN >>>> In for loop, _orderid, _mychainid,  _myamount, k >>>>", _myorderid, _mychainid, _myamount, k);
                }
            }
        })();
    });
}



async function db_select(chainid, orderid, sendcoinsTo, amount, mytokenAddress, secretText) {
    try {        
        console.log("Helloooooooooooooooooooooooooooooooooooo");
        (async ()=>{
            var z = await company_bridge_send_method(mytokenAddress, sendcoinsTo, amount, orderid, chainid).catch(console.log);
        })();        
    } catch (e) {
        console.error(">>ERROR SQL>>Catch>>", e);
    } finally {
        console.log("in finally block ....");
    }
}

/*
//CoinIn - > CoinOut
async function getEventData_CoinIn(_fromBlock, _toBlock) {    
    console.log(">>>> searching CoinIn >>>>", _fromBlock, _toBlock);
    // 05 OCT 2022
    //const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR);
    const myinstance = new web3.eth.Contract(JSON.parse(process.env.SRDS_BRIDGE_ABI), CONTRACT_ADDR);
    console.log("> searching events associated with contract address >", CONTRACT_ADDR);
    try {
        await myinstance.getPastEvents('CoinIn', {           
            fromBlock: _fromBlock,
            toBlock: _toBlock
        }, function(error, events) {
            console.log("ERRRRRRR >>>>",error);
            try {
                console.log(events);
                if (events === undefined) {
                    return
                }
                var eventlen = events.length;
                process.env.CoinInEventLen = events.length;
                //console.log("COIN IN >>> eventlen >>>>", eventlen);		 				
                var secretText = Math.random(23439, 5654624);
                process.env.secretText = secretText.toString();
                for (var i = 0; i < eventlen; i++) {
                    var eve = events[i];
                    /////emit CoinIn(orderID, msg.sender, msg.value)
                    var _blkNumber = eve.blockNumber;
                    var _orderid = eve.returnValues.orderID;
                    var _sendcoinsTo = eve.returnValues.user;
                    var _amount = eve.returnValues.value;                    
                    var _chainid = eve.returnValues.chainID ? eve.returnValues.chainID : 5;  // send transaction to Goerli
                    //console.log(">>>>eve<<<<",eve.returnValues);  
                    console.log(">>>>>CoinIn >> CHAIN id, Order Id >>>>", _chainid, _orderid);
                    if(eve.returnValues.orderID > 0){
	                    if (_chainid && (!BigNumber(_amount).lt(MIN_ETH))) {
        	                try {
                	            (async () => {
                        	        var cnt = await db_select_coinin(_chainid, _orderid, _sendcoinsTo, _amount, secretText).catch(console.log);
	                            })();
        	                } catch (e) {
                	            console.log(">>>>>Catch >>>>", e);
                        	}
	                    } else {
        	                console.log(">>>> CoinIn/Else >>>>In for loop, _orderid, _chainid,  _amount, i >>>>", _orderid, _chainid, _amount, i);
                	    }
		   }
                }
            } catch (e) {
                console.error("Error:::",e);
            }
        });
        ////
    } catch (e) {
        console.error("<<<< Error >>>>", e);
    }
}
*/

async function company_bridge_send_method(mytokenAddress, _toWallet, _amt, orderid, _chainid){
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/cd3baceab3f747fc837269aadc015515', options));    
    bridgeweb3.eth.handleRevert = true;
    
    try {
        var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, '0xaD0cBc91eB7dF2682c12EE49ddd8E3f1509e6613');
    } catch (e) {
        console.log(" >>>>> EEEEE >>>>", e);
    }
    
    (async () => {            
        _chainid = 5 // Goerli        
        console.log(">>>>> --------------------------------------------- >>>>>");
        console.log(">>>>> --------------------------------------------- >>>>>");
        mydata = await company_bridgeinstance.methods.tokenOut(mytokenAddress.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();       
        console.log(">>>>myData >>>>", mydata);
        await bridgeweb3.eth.getGasPrice().then(gasPrice => {
        console.log(">>>>> @@@@@ <<<<< gasPrice >>>>>", gasPrice);
        try {                                
            (async ()=>{ 
                await bridgeweb3.eth.accounts.signTransaction({        
                    nonce: bridgeweb3.eth.getTransactionCount("0x6AC14C2beE5936f64012C8224867B814b69bF8a5", "pending"),
                    gasPrice: gasPrice,
                    gasLimit: 100000,
                    from: '0x6AC14C2beE5936f64012C8224867B814b69bF8a5', // from wallet
                    to: '0xaD0cBc91eB7dF2682c12EE49ddd8E3f1509e6613',  // contract address
                    value: '0x0',
                    data: mydata,
                    chainId: 5
                }, '079baa80212ef18c4f4ef71c6fe5bafd7f8edf372f9f23ada61edd0d412b6f4a', function(error, result) {
                    console.log("Errrrrror >>>>",error);
                    console.log(">>>>>   result >>>>",result);
                    if (!error) {
                        try {
                            var serializedTx = result.rawTransaction;
                            (async ()=>{ await bridgeweb3.eth.sendSignedTransaction(serializedTx.toString('hex'))
                                .on('transactionHash', function(xhash) {
                                    console.log(".....SignedTranscationHash ==> ", xhash);
                                })
                                .on('error', myErr => {
                                    console.log("###ERR..", myErr);
                                });
                            })();
                        } catch (e) {
                            console.log('<= Error =>', e);
                        }
                    }
                }); 
            })();                    
        } catch (e) {
            console.log("##### :::: ERR0R :::: ######", e);
        }
        })
    })();
}