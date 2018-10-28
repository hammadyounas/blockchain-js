const SHA256 = require('crypto-js/sha256');

class block {
    constructor(index,timestamp,data,previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nounce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nounce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined",this.hash);
    }
}

class blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }
    createGenesisBlock(){
        return new block(0,"01/01/2018","Gensis block","0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
         newBlock.previousHash = this.getLatestBlock().hash;
         newBlock.mineBlock(this.difficulty)
        //  newBlock.hash = newBlock.calculateHash();
         this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                // console.log("current block =>",)
                // debugger;
                return false;
            }

            return true
        }
    }
}

let contract = new blockchain();

console.log("mining block 1...");
contract.addBlock(new block(1,"10/10/2018",{amount:4000}));

console.log("mining block 2...");
contract.addBlock(new block(2,"12/10/2018",{amount:8000}));

// console.log("is valid chain ?",contract.isChainValid());
// contract.chain[1].data = {amount :100}
// contract.chain[1].hash = contract.chain[1].calculateHash();
// console.log("is valid chain ?",contract.isChainValid());

console.log(JSON.stringify(contract,null,4));