import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Voting from "./contracts/Voting.json";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  TextField:{
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
}));

const App = () => {
  const classes = useStyles(); //setting style class
  const [chooseid, setChooseid] = useState(""); //for choosing project id 
  const [vote_value, setVotevalue] = useState(0); // value for voting
  
  const handleChange = (e, type) => {
    const value = e.target.value;
    type === 'id' ? setChooseid(value) : setVotevalue(value)
  }

  const [refresh, setrefresh] = useState(0);
  //input value

  // web3 state variables
  let content;
  const [problemloading, setProblemLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  
  //states related to the Voting
  const [Votingcont, setVotingcont] = useState();
  const [contractowner, setContractOwner] = useState("");
  const [limitforproj, setlimitforproj] = useState(3);
  const [Projects, setProjects] = useState([]);
  const [projdescription, setProjdescription] = useState("");
  const [num_of_allowed_proj, setNum_of_allowed_proj] = useState(0);
  const [proj_proposed, setProj_proposed] = useState();
  const [connected, setconnected] = useState(0);

  
  //loading web3 
  const loadWeb3 = async () =>{
    if (window.ethereum){
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    } else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    } else{
      window.alert("The browser doesn't support web3, please install metamask (https://metamask.io/)")
    }
  }

  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId();
    const networkData = Voting.networks[networkId];
    console.log(networkId, networkData)

    if(networkData){
      const votingContract = new web3.eth.Contract(
        Voting.abi, networkData.address
      );

      setVotingcont(votingContract);

      const owner = await votingContract.methods.Owner().call();
      console.log(owner);
      setContractOwner(owner);
      const proj_limit = await votingContract.methods.Proposal_limit().call();
      setNum_of_allowed_proj(proj_limit)

      var x = await votingContract.methods.Project_num().call();
      var arr = [];

      for (var i = 0; i < x; i++) {
        await votingContract.methods.Projects(i).call()
          .then((Project) => {
            arr = [
              ...arr,
              { id: i + 1, description: Project[0], total_votes: Project[1], likes : Project[2], dislikes : Project[3], abstention : Project[4] },
            ];
          });
      }
      setProjects(arr);

      setLoading(false);
      
    } else {
      window.alert("the contract is not deployed to the detected network.");
      setProblemLoading(true);
    }
  };

  
  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  useEffect(() => {
    loadWeb3().then(loadBlockchainData())
    
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('connect', () => {
        setconnected(1);
      })
      
        
    }


    //esl
  }, [refresh]);

  const addProject = async () => {
    console.log(projdescription);
      
    try {
      await Votingcont.methods
        .add_project(projdescription)
        .send({ from: account })
        .then((a) => {
          let proj_id = a.events.registered_project.returnValues.project_num;
          let descrip = a.events.registered_project.returnValues.description;
          let vot = a.events.registered_project.returnValues.total_votes;
          let lik = a.events.registered_project.returnValues.likes;
          let dislik = a.events.registered_project.returnValues.dislikes;
          let unsur = a.events.registered_project.returnValues.unsure;
          
          setProjects([...Projects, { id: proj_id, description: descrip, total_votes: vot, likes : lik, dislikes : dislik, unsure : unsur }]);
          let p_p = a.events.increased_proj_proposed.returnValues.proposed_num;
          console.log(p_p);
          setProj_proposed(parseInt(p_p));
          console.log(proj_proposed);
        });
        var success = 1;
    } catch (err) {
      var success = 0;
      var accounts = await window.web3.eth.getAccounts();

      if(accounts.length>0){
        window.alert("You cannot submit more proposals than the set limit");
      }else{
       window.alert("Ethereum account not connected! please connect");
      }
    }
    if(success){
    console.log(Projects);
    setProjdescription("");
    window.location.reload();
    
    };
  };

  const givevote = async () => {
    try {
      let ChoiceId = chooseid - 1;
      let voting_value = vote_value;
      await Votingcont.methods
        .vote(ChoiceId, voting_value)
        .send({ from: account })
        .then((a) => {
          let id_returned = a.events.Voted.returnValues.prod_id;
          console.log(id_returned);
        });
      var success = 1;
    } catch (err) {
      var success = 0;
      var accounts = await window.web3.eth.getAccounts();

      if(accounts.length>0){
        window.alert("You have already voted!");
      }else{
        window.alert("Ethereum account not connected! please connect");
      }
    }
    if(success){
    window.location.reload();
    }
    
  };

  const changelimit = async () => {
    try {
      let limit_val =  limitforproj;
      
      await Votingcont.methods
        .change_proposal_limit(limit_val)
        .send({ from: account })
        .then((a) => {
          let limit_returned = a.events.changed_proposal_limit.returnValues.limit_val;
          console.log(limit_returned);
          setNum_of_allowed_proj(limit_returned);
        });
      var success=1;
    } catch (err) {
      var success=0;
      var accounts = await window.web3.eth.getAccounts();

      if(accounts.length>0){
        window.alert("You must be the owner of the contract to do this");
      }else{
        window.alert("Ethereum account not connected! please connect");
      }
      
    }
    if(success){
    window.location.reload();
    };
  };
 
  

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{problemloading ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    const value_select = [-1,0,+1];
    content = (
      <div className="app">
        <div className="table">
          <Table Projects={Projects} />
        </div>
        <div className="do_vote">
          <h3>Select a project and click the "VOTE" button</h3>
          <h3>1 : like, 0 : unsure, -1 : dislike </h3>
        </div>
        <div className="input_id">
          <FormControl className={classes.formControl}>
            <InputLabel id="select_id">Select ID</InputLabel>
            <Select
              labelId="select_id"
              id="select_id"
              value={chooseid}
              onChange={(e) => handleChange(e, 'id')}
            >
              {
                Projects.length !== 0 ? (
                  Projects.map((project, idx) => ( 
                    <MenuItem key={idx} value={project.id}>
                      {project.id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={0}>No project</MenuItem>
                )
                // generateMenuItem()
              }
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="select_value">vote value</InputLabel>
            
            <Select
              labelId="select_value"
              id="select_value"
              value={vote_value}
              onChange={(e) => handleChange(e, 'value')}
            >
              {
              value_select.map((val, idx) => {
                return <option key={idx} value={val}>{val} </option>
              })
            }
            </Select>
          </FormControl>


          <Button variant="contained" onClick={givevote}>
            VOTE
          </Button>
        </div>

        <div className="after_voting">
          {<h6>You can vote only once per proposal (project)</h6>}
        </div>
        {/* <div className="showinguser_address">
          <h4>Your Address: {account}</h4>
        </div>
         */}
        

        
          <div className="add_project" id="add">
            <h3>Enter a short proposal statement:</h3>
            <h3>You can propose up to # of proposals set by the owner of the contract (default is 3 per person)</h3>
            <h3>Current limit : {num_of_allowed_proj}</h3>

            <form className="project_form">
              <TextField
                id="standard-full-width"
                label="description"
                autoComplete="off"
                //variant="outlined"
                multiline
                fullWidth
                value={projdescription}
                onChange={(e) => setProjdescription(e.target.value)}
              />
              
            </form>
            <Button variant="contained" onClick={addProject}>
              SUBMIT
            </Button>
          </div>

          <div className="add_project" id="change">
            <h3>Change the upper limit for the number of proposals (default is 3 per person):</h3>
            <h3>Only owner can change it</h3>

            <form className="project_form">
              <TextField
                id="outlined-basic"
                label="upper limit"
                autoComplete="off"
                variant="outlined"
                multiline= "true"
                value={limitforproj}
                onChange={(e) => setlimitforproj(e.target.value)}
              />
              
            </form>
            <Button variant="contained" onClick={changelimit}>
              SUBMIT
            </Button>
          </div>
        
          <div className="footer">
          <h4>Made by arahangua</h4>
          </div> 

      </div>
    );
  }
  // result={result}
  return (
    <div>
      <Navbar account={contractowner} />

      {account === "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
