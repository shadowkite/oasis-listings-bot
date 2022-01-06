const { exec } = require("child_process");
const oasisABI = require('./abi/oasis.json');
const {ethers} = require("ethers");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var shellescape = require('shell-escape');

// Setup network
var provider = new ethers.providers.JsonRpcProvider('https://smartbch.fountainhead.cash/mainnet', 10000);
var wallet = ethers.Wallet.createRandom();

const account = wallet.connect(provider);

// Load OASIS contract
let oasisContract = new ethers.Contract('0x657061bf5D268F70eA3eB1BCBeb078234e5Df19d', oasisABI.abi, account);

// Load common ERC721 ABI
let erc721abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "baseURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let approvedNFTs = [
    '0xE765026Cad648785b080E78700cBF6fa1C050d7C', // CashCats
    '0xD27CFd5b254E8D958c0c8e7f99E17A1e33652C1A', // CryptoR.AT
    '0x88fA0495d5E9C1B178EAc1D76DF9D729e39fD8E8', // Poolside Puffers
    '0x142d360e65d664B3074d03A1AC3fCDECFeCBC5F9', // TROPICAL.GULLS
    '0xe017AC8A93790571AF6a93f34cE2258dC900006B', // TROPICAL.MONSTER
    '0xa48C513189F8971736A1e4f3E786f471bf1EBfE1', // DAIQUI.DUDES
    '0xff48aAbDDACdc8A6263A2eBC6C1A68d8c46b1bf7', // LawPunks
    '0x9F6466C0ffe9245d994C18c8B0575Af22a5AeEd5', // Cattos
    '0xf913c55C9E3642dbaA62c26Ff010e97565DeD3B1', // Fatcat
    '0x8FdC63Fe8496D819731e1d447B1eB35951798AA3', // DAOer
    '0x23d9B4b351d5C57f38206dB0697B891d2A32732E', // Potato
    '0xdccB0e678bEA8FE3d97921CbFF85Be757a223312', // BWB series
    '0x147f7D752ed7375E4e7B50aC2C94723F171cE90d', // RealMoutai
];

// Order type # to name
let translateOrderType = function(type) {
    var translatedOrderType = 'Unknown';
    switch(type) {
        case 0: translatedOrderType = 'Fixed price'; break;
        case 1: translatedOrderType = 'Dutch auction'; break;
        case 2: translatedOrderType = 'English auction'; break;
    }
    return translatedOrderType;
}

// Get image, when it fails always return null
let getPhotoForToken = async function(token, id) {
    var nft = new ethers.Contract(token, erc721abi, account);
    return nft.tokenURI(id).then(function(url) {
        return fetch(url).then(async function (response) {
            return response.json();
        }).then(function (data) {
            return data.image;
        }).catch(function () {
            return null;
        });
    }).catch(function() {
        return null;
    });
}

// Send TG messages
let sendTgMessage = async function(token, id, message) {
    // Only approved collections
    if(!approvedNFTs.includes(token)) {
        return;
    }

    getPhotoForToken(token, id).then(function(photo) {
        if(photo === null) {
            // No photo? Display OASIS logo instead
            photo = 'https://oasis.cash/assets/images/oasis_logo.svg';
        }

        var nft = new ethers.Contract(this.token, erc721abi, account);
        nft.name().then(function(tokenName) {
            // Generate full message
            var fullMessage = '[' + tokenName + ' #' + this.id + '](https://oasis.cash/token/' + this.token + '/' + this.id + ')\n\n'
                + this.message
                + '\n\n[View collection](https://oasis.cash/collection/' + this.token + ')';

            // Send message
            // @TODO change this to a less awkward way to send the message. Use CURL directly from JS ideally
            var cmd = shellescape(['php', 'bin/tg-message.php', this.photo, fullMessage]);
            console.log(cmd);
            //exec(cmd, (error, stdout, stderr) => {
                // console.log(stdout);
            //});
        }.bind({token: this.token, id: this.id, photo: photo, message: this.message}));
    }.bind({token: token, id: id, message: message}));
}

async function main() {
    // event Bid(IERC721 indexed token, uint256 id, bytes32 indexed hash, address bidder, uint256 bidPrice);
    oasisContract.on('Bid', function(token, id, hash, bidder, bidPrice) {
        sendTgMessage(
            token,
            id,
            '↗️ Received bid for ' + ethers.utils.formatEther(bidPrice.toString()) + ' BCH');
    });

    // event Claim(IERC721 indexed token, uint256 id, bytes32 indexed hash, address seller, address taker, uint256 price);
    oasisContract.on('Claim', function(token, id, hash, seller, taker, price) {
        sendTgMessage(
            token,
            id,
            '✅ Sold for ' + ethers.utils.formatEther(price.toString()) + ' BCH');
    });

    // event MakeOrder(IERC721 indexed token, uint256 id, bytes32 indexed hash, address seller);
    oasisContract.on('MakeOrder', function(token, id, hash, seller) {
        oasisContract.getCurrentPrice(hash).then(function(price) {
            oasisContract.orderInfo(this.hash).then(function(orderInfo) {
                sendTgMessage(
                    this.token,
                    this.id,
                    '✳️ Listed for ' + ethers.utils.formatEther(this.price.toString()) + ' BCH\n'
                    + 'Auction type: ' + translateOrderType(orderInfo.orderType)
                );
            }.bind({token: this.token, id: this.id, price: price}));
        }.bind({token: token, id: id, hash: hash}));
    });
}

main();