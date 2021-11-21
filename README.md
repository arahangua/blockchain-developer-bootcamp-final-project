# Voting / Project Proposal Dapp   
Currently, this project is a very simple voting / project proposal dapp with barebone functionalities implemented. The long-term vision is to build an analysis pipeline that can characterize the consensus behavior of the community by treating each person's voting history as time-series data (e.g. with enough voting history accumulated, computing covariance matrix between users' voting history)

## Implemented features
1. Users can propose projects (in text) (there is a limit for the number of projects that can be proposed per person)
2. Users can only vote once for each suggested project
3. For each vote, users can cast 3 options : 1. Like, 2. dislike, 3. indifferent/unsure (e.g. didn't understand the proposal)
4. The owner of the contract can change the limit for per-person proposable number of projects.

## Where is it currently deployed?
1. Public interface (front-end) (github pages):
[https://arahangua.github.io/blockchain-developer-bootcamp-final-project/](https://arahangua.github.io/blockchain-developer-bootcamp-final-project/)

2. Deployed testnet : 
This project is currently deployed to Ropsten network (please check 'deployed_address.txt')

## Installation / how to run (test) this project
### Setting up an environment
1. Install Node.js
    Node.js version used in this project = 14.18.1
2. Instal truffle suite
3. Install [Ganache-cli](https://www.npmjs.com/package/ganache-cli)
4. Install [Metamask](https://metamask.io/)

### testing / running the project
1. git clone this project
2. (Smart contract) from the root of this project, type
```
    npm install
```    
3. (frontend) move to the 'client' directory and run install command
```
    cd client
    npm install
```
4. open a new terminal and spin up ganache (local ganache blockchain should use the port : 8545)
```
    ganache-cli
```
4. To run the test script, move back to the root of the project and type
```
    truffle test
```
## screencast 
    pending 




## Acknowledgement
For the front-end design : https://github.com/bukosabino/truffle-voting-dapp

For the general project structure : https://github.com/francisldn/blockchain-developer-bootcamp-final-project



  
