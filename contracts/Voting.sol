// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';


contract Voting is ReentrancyGuard{

    using Address for address;
    using SafeMath for uint256;
    using SafeMath for int256;
    
    //'project' construct 
    struct Project{
        string description;
        uint256 total_votes;
        uint256 likes;
        uint256 dislikes;
        uint256 unsure;
        //mapping(address => bool) voted;
    
    }

    //global public variables
    
    mapping(uint256 => mapping(address => bool)) public Proj_to_voted;
    address public Owner;
    mapping(uint256 => Project) public Projects;
    mapping(address => uint256) public Proposed;
    uint256 public Project_num;
    uint256 public Proposal_limit;
    

    //initialization 
    constructor(){
        Owner = msg.sender;
        Proposal_limit=3;
        Project_num = 0;
    }

    //modifiers
    modifier isOwner(){
        require(Owner == msg.sender, "you need to be the owner to execute this function");
        _;
    }

    modifier not_voted_for(uint256 proj_id){
        require(Proj_to_voted[proj_id][msg.sender] ==false, "you've already voted for this project");
        _;

    }

    modifier less_than_limit(address add){
        require(Proposed[add]<= Proposal_limit-1, "exceeding the upper limit for number of proposable projects");
        _;
    }

    modifier existing_proj(uint256 proj_id){
        require(proj_id <= Project_num-1, "project id exceeds the number of existing projects!");
        _;
    }
    //events

    event registered_project(uint256 project_num, string description, uint256 total_votes, uint256 likes, uint256 dislikes, uint256 unsure);
    event increased_proj_num(uint256 project_num);
    event increased_proj_proposed(uint256 proposed_num);
    event Voted(uint256 proj_id, address add);
    event changed_proposal_limit(uint256 limit_val);
    event logging_vote(uint256 proj_id, address add);

    //functions
    function add_project(string memory description) public less_than_limit(msg.sender) {
        Projects[Project_num] = Project(description, 0,0,0,0); //without mapping variable
        emit registered_project(Project_num, description, 0,0,0,0);
        Project_num ++; //increment by 1
        emit increased_proj_num(Project_num);
        Proposed[msg.sender]++;
        emit increased_proj_proposed(Proposed[msg.sender]);
        
    }

    function vote(uint256 proj_id, int256 vote_value) public existing_proj(proj_id) not_voted_for(proj_id){
        Proj_to_voted[proj_id][msg.sender] = true;
        emit logging_vote(proj_id, msg.sender);
        Projects[proj_id].total_votes++;
        if(vote_value==-1){
            Projects[proj_id].dislikes++;
        } else if(vote_value==1){
            Projects[proj_id].likes++;
        } else if(vote_value==0){
            Projects[proj_id].unsure++;
        }

        emit Voted(proj_id, msg.sender);

        
    }

    function change_proposal_limit(uint256 limit_val) public isOwner() returns (uint256){
        Proposal_limit = limit_val;
        emit changed_proposal_limit(limit_val);
        return Proposal_limit;
    }

    function get_project_num() public view returns (uint256){
        return Project_num;

    }

    function get_proposal_limit() public view returns (uint256){
        return Proposal_limit;
    }

    






}