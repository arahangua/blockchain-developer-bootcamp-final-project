// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

/// @title simple voting + project proposal dapp 
/// @author Taehoon Kim

contract Voting is ReentrancyGuard{
    /// @notice implements both project suggestion and voting
    /// @notice imports Openzeppelin libraries as safety measures.
    /// @notice For this specific usage, SafeMath might have been not that necessary
    using Address for address;
    using SafeMath for uint256;
    using SafeMath for int256;
    
    /// @notice 'Project' struct variable definition.
    /// @notice stores both the description of the project and vote results
    struct Project{
        string description;
        uint256 total_votes; // total votes = likes + dislikes + unsure
        uint256 likes;
        uint256 dislikes;
        uint256 unsure;
        
    }

    ///@notice public variables 
    mapping(uint256 => mapping(address => bool)) public Proj_to_voted; // mapping var. to check whether a user voted for the project(proposal) 
    address public Owner; // owner of the contract
    mapping(uint256 => Project) public Projects; // project id -> project
    mapping(address => uint256) public Proposed; // counting how many projects/proposals were suggested by a user
    uint256 public Project_num; // variable to track the number of proposals suggested (from all users) 
    uint256 public Proposal_limit; // per-person limit for suggesting new proposals
    

    ///@notice initialization, sets 1) the owner, 2) per-person proposal limit 3) starting number of proposals (zero..)
    constructor(){
        Owner = msg.sender;
        Proposal_limit=3;
        Project_num = 0;
    }

    //modifiers 
    ///@notice checking if msg. sender is the owner
    modifier isOwner(){
        require(Owner == msg.sender, "you need to be the owner to execute this function");
        _;
    }
    ///@notice checking if msg. sender has already voted for the proposal
    ///@param proj_id id of the project
    modifier not_voted_for(uint256 proj_id){
        require(Proj_to_voted[proj_id][msg.sender] ==false, "you've already voted for this project");
        _;

    }
     
    ///@notice checking if msg.sender hasn't gone over the proposal limit
    ///@param add address of the msg.sender
    modifier less_than_limit(address add){
        require(Proposed[add]<= Proposal_limit-1, "exceeding the upper limit for number of proposable projects");
        _;
    }

    /// @notice checking if msg.sender is trying to vote for non-existing projects.
    /// @param proj_id id alias of the project to vote
    modifier existing_proj(uint256 proj_id){
        require(proj_id <= Project_num-1, "project id exceeds the number of existing projects!");
        _;
    }

    //events
    ///@notice logging if a project was successfully proposed(submitted...)  
    ///@notice input parameters follow the struct definition of 'Project' variable.
    event registered_project(uint256 project_num, string description, uint256 total_votes, uint256 likes, uint256 dislikes, uint256 unsure);
    
    ///@notice logging when there is an increase in the number of proposed projects 
    ///@param project_num integer value that tracks the number of projects
    event increased_proj_num(uint256 project_num);

    ///@notice logging if there is an increase in the number of proposed projects per user.
    ///@param proposed_num integer value that tracks the number of proposals per user
    event increased_proj_proposed(uint256 proposed_num);

    ///@notice logging if the voting was successfully done
    ///@param proj_id, project id and @param add msg.sender address
    event Voted(uint256 proj_id, address add);

    ///@notice logging the change in the upper limit for the number of proposals that can be suggested per person
    ///@param limit_val new integer value for the limit
    event changed_proposal_limit(uint256 limit_val);

    ///@notice logging if the voting was possible for that user (similar to the above "Voted" event)
    ///@notice only difference being that this event gets triggered right after voting function is triggered. 
    ///@param proj_id id and @param add msg.sender address
    event logging_vote(uint256 proj_id, address add);

    //functions
    ///@notice main function to add project / proposal 
    ///@param description string input to describe the project / proposal
    function add_project(string memory description) public less_than_limit(msg.sender) {
        Projects[Project_num] = Project(description, 0,0,0,0); 
        emit registered_project(Project_num, description, 0,0,0,0);
        Project_num ++; //increment by 1
        emit increased_proj_num(Project_num);
        Proposed[msg.sender]++;
        emit increased_proj_proposed(Proposed[msg.sender]);
        
    }
    ///@notice main function to cast a vote
    ///@param proj_id project id and @param vote_value vote values (1: like, 0 : indifferent, -1 : dislike) 
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

    ///@notice function to change the upper limit (number of per-person proposable projects)
    ///@notice can only be triggered by the owner of the contract
    ///@param limit_val integer for the new limit 
    ///@return the changed limit
    function change_proposal_limit(uint256 limit_val) public isOwner() returns (uint256){
        Proposal_limit = limit_val;
        emit changed_proposal_limit(limit_val);
        return Proposal_limit;
    }

    ///@notice function to get number of currently existing projects
    ///@return number of existing projects
    function get_project_num() public view returns (uint256){
        return Project_num;

    }

    ///@notice function to get current limit (per-person proposable number of projects) 
    ///@return current upper limit 
    function get_proposal_limit() public view returns (uint256){
        return Proposal_limit;
    }

    






}