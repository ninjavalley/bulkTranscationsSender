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

TranscationSender();

function TranscationSender() {
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/cd3baceab3f747fc837269aadc015515', options));    
    bridgeweb3.eth.handleRevert = true;
    var  CONTRACT_ADDR_ABI = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"outputCurrency","type":"address"}],"name":"CoinIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"outputCurrency","type":"address"}],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]');
    try {
        var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, '0xaD0cBc91eB7dF2682c12EE49ddd8E3f1509e6613');
    } catch (e) {
        console.log(" >>>>> EEEEE >>>>", e);
    }
    
    (async () => {        
        var _amt = 1;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        for(i=0;i<10;i++){
            await wait(2000);
            _chainid = 5 // Goerli
            _amt = i+1;
            console.log(">>>>> --------------------------------------------- >>>>>");
            console.log(">>>>> --------------------------------------------- >>>>>");
            console.log(">>> Sending Amount i, _amt >>>", i, _amt);
            console.log(">>>>> --------------------------------------------- >>>>>");
            console.log(">>>>> --------------------------------------------- >>>>>");
            var mydata = await company_bridgeinstance.methods.tokenIn('0xd3892389Fdd6c5CE95FafCE97609795a75dB7B63', _amt.toString(), _chainid.toString()).encodeABI();
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
        }
    })();
}