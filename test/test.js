const Voting = artifacts.require("./Voting.sol");
let { catchRevert } = require("./exceptionsHelpers.js");

contract("Voting", async accounts => {
  //setting up instances
    

  it("should return 3 as the initial limit for per person number of proposals", async () => {
    const instance = await Voting.deployed();
    const result = await instance.get_proposal_limit.call({from: accounts[0]});
    const result_num = result.toNumber();
    assert.equal(result_num, 3, 'something went wrong with the initialization of the upper limit (per-person proposals)');
  });
  
  it("should return 0 for the number of existing projects", async () => {
    const instance = await Voting.deployed();
    const result = await instance.get_project_num.call({from: accounts[0]});
    const result_num = result.toNumber();
    assert.equal(result_num, 0, 'something went wrong with the initialization of the variable storing the number of existing projects');
  });

  it("should return 1 for the number of existing projects once a project is added", async () => {
    const instance = await Voting.deployed();
    await instance.add_project("testing",{from:accounts[0]});
    const result = await instance.get_project_num.call({from: accounts[0]});
    const result_num = result.toNumber();
    assert.equal(result_num, 1, 'the number of existing projects did not show a proper increment');
  });

  it("Owner should be able to change the per person number of proposals", async () => {
    const instance = await Voting.deployed();
    const result = await instance.change_proposal_limit.call(5,{from: accounts[0]});
    const result_num = result.toNumber();
    assert.equal(result_num, 5);
  });

  it("Only owner should be able to change the upper limit for the number of proposals", async () => {
    const instance = await Voting.deployed();
    await catchRevert(instance.change_proposal_limit(3,{from: accounts[1]}))
  });

  it("Users cannot submit more proposals than the number set by the upper limit", async () => {
    const instance = await Voting.deployed();
    //revert back the proposal limit to 3
    await instance.change_proposal_limit(3, {from: accounts[0]});
    //adding 1
    await instance.add_project("adding 1", {from: accounts[1]});
    await instance.add_project("adding 2", {from: accounts[1]});
    await instance.add_project("adding 3", {from: accounts[1]});
    
    await catchRevert(instance.add_project("adding 4th", {from: accounts[1]}));
  });
  
});
