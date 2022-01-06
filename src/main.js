const { exec } = require("child_process");
const oasisABI = require('./abi/oasis.json');
const {ethers} = require("ethers");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

let translateOrderType = function(type) {
    var translatedOrderType = 'Unknown';
    switch(type) {
        case 0: translatedOrderType = 'Fixed price'; break;
        case 1: translatedOrderType = 'Dutch auction'; break;
        case 2: translatedOrderType = 'English auction'; break;
    }
    return translatedOrderType;
}

let sendTgMessage = function(token, id, photo, message) {
    var nft = new ethers.Contract(token, erc721abi, account);
    nft.name(token).then(function(tokenName) {
        var fullMessage = '[' + tokenName + ' #' + id + '](https://oasis.cash/token/' + token + '/' + id + ')\n\n'
            + message
            + '\n\n[View collection](https://oasis.cash/collection/' + token + ')';

        // @TODO change this to a less awkward way to send the message. Use CURL directly from JS ideally
        exec("php bin/tg-message.php '" + photo + "' '" + fullMessage + "'", (error, stdout, stderr) => {
            console.log(stdout);
        });
    }.bind({info: this}));
}

async function main() {
    // event MakeOrder(IERC721 indexed token, uint256 id, bytes32 indexed hash, address seller);
    // event CancelOrder(IERC721 indexed token, uint256 id, bytes32 indexed hash, address seller);
    // event Bid(IERC721 indexed token, uint256 id, bytes32 indexed hash, address bidder, uint256 bidPrice);
    // event Claim(IERC721 indexed token, uint256 id, bytes32 indexed hash, address seller, address taker, uint256 price);

    oasisContract.on('Bid', function(token, id, hash, bidder, bidPrice) {
        var nft = new ethers.Contract(token, erc721abi, account);
        nft.tokenURI(id).then(function(url) {
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(data) {
                sendTgMessage(
                    this.token,
                    this.id,
                    data.image,
                    '↗️ Received bid for ' + ethers.utils.formatEther(this.bidPrice.toString()) + ' BCH');
            }.bind({token: this.token, id: this.id, bidder: this.bidder, bidPrice: this.bidPrice})).catch(function() {
                // Can't get image
                sendTgMessage(
                    this.token,
                    this.id,
                    'https://oasis.cash/assets/images/oasis_logo.svg',
                    '↗️ Received bid for ' + ethers.utils.formatEther(this.bidPrice.toString()) + ' BCH');
            }.bind({token: this.token, id: this.id, bidder: this.bidder, bidPrice: this.bidPrice}));
        }.bind({token: token, id: id, bidder: bidder, bidPrice: bidPrice}));
    });

    oasisContract.on('Claim', function(token, id, hash, seller, taker, price) {
        var nft = new ethers.Contract(token, erc721abi, account);
        nft.tokenURI(id).then(function(url) {
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(data) {
                sendTgMessage(
                    this.token,
                    this.id,
                    data.image,
                    '✅ Sold for ' + ethers.utils.formatEther(this.price.toString()) + ' BCH');
            }.bind({token: this.token, id: this.id, seller: this.seller, taker: this.taker, price: this.price})).catch(function() {
                sendTgMessage(
                    this.token,
                    this.id,
                    'https://oasis.cash/assets/images/oasis_logo.svg',
                    '✳️ Listed for ' + ethers.utils.formatEther(this.price.toString()) + ' BCH\n'
                    + 'Auction type: ' + translateOrderType(this.orderInfo.orderType)
                );
            }.bind({token: this.token, id: this.id, seller: this.seller, price: this.price, orderInfo: orderInfo}));
        }.bind({token: token, id: id, seller: seller, taker: taker, price: price}));
    });

    oasisContract.on('MakeOrder', function(token, id, hash, seller) {
        oasisContract.getCurrentPrice(hash).then(function(price) {
            oasisContract.orderInfo(this.hash).then(function(orderInfo) {
                var nft = new ethers.Contract(this.token, erc721abi, account);
                nft.tokenURI(this.id).then(function (url) {
                    fetch(url).then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        sendTgMessage(
                            this.token,
                            this.id,
                            data.image,
                            '✳️ Listed for ' + ethers.utils.formatEther(this.price.toString()) + ' BCH\n'
                             + 'Auction type: ' + translateOrderType(this.orderInfo.orderType)
                        );
                    }.bind({token: this.token, id: this.id, seller: this.seller, price: this.price, orderInfo: orderInfo})).catch(function() {
                        sendTgMessage(
                            this.token,
                            this.id,
                            'https://oasis.cash/assets/images/oasis_logo.svg',
                            '✳️ Listed for ' + ethers.utils.formatEther(this.price.toString()) + ' BCH\n'
                            + 'Auction type: ' + translateOrderType(this.orderInfo.orderType)
                        );
                    }.bind({token: this.token, id: this.id, seller: this.seller, price: this.price, orderInfo: orderInfo}));
                }.bind({token: this.token, id: this.id, seller: this.seller, price: this.price}));
            }.bind({token: this.token, id: this.id, seller: this.seller, price: price}));
        }.bind({token: token, id: id, hash: hash, seller: seller}));
    });
}

main();