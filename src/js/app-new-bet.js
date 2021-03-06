App = {
  web3Provider: null,
  contracts: {},
  ipfs: null,

  init: function() {
    App.ipfs = new IPFS();
    App.ipfs.setProvider({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const hash = "QmQtwERJbXkS34fdQbk4HLyyW9sc4TXZ4XvAMUZwzCXPWD";
    App.ipfs.cat(hash, (err, data) => {
      if (err) {
        return console.log(err);
      }
      console.log("DATA:", data);
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    App.web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Bet.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BetArtifact = data;
      App.contracts.Bet = TruffleContract(BetArtifact);
    
      // Set the provider for our contract
      App.contracts.Bet.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      //return App.loadBets();
    });

    $.getJSON('PutUpOrShutUp.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PutUpOrShutUpArtifact = data;
      App.contracts.PutUpOrShutUp = TruffleContract(PutUpOrShutUpArtifact);
    
      // Set the provider for our contract
      App.contracts.PutUpOrShutUp.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      //return App.loadBets();
    });


    return App.bindEvents();
  },

  loadBets: function() {
    console.log("Hello world!"); 
  },

  bindEvents: function() {
    $('#create-bet-btn').click(App.betButton)
  },

  betButton: function(e) {
    e.preventDefault();
    let a = new Bet(App.contracts, App.ipfs, App.getBetFormValues());
    // a.getFundingStatus()
    if(!a.create()) {
      //something 
    }
    console.log(a)
  
  },

  getBetFormValues: function() {
    var newBetProperties = {};
    newBetProperties.title = document.getElementById('bet-title').value;
    newBetProperties.descriptionText = document.getElementById('bet-language').value;
    newBetProperties.instigatorHandle = document.getElementById('bettor-twitter').value;
    newBetProperties.instigatorAddress = document.getElementById('bettor-wallet').value;
    newBetProperties.instigatorBetAmount = App.web3.toWei(document.getElementById('bettor-amount').value)
    newBetProperties.takerHandle = document.getElementById('taker-twitter').value;
    newBetProperties.targetAddress = document.getElementById('taker-wallet').value;
    newBetProperties.targetBetAmount = App.web3.toWei(document.getElementById('taker-amount').value)
    newBetProperties.arbiterHandle = document.getElementById('arbiter-twitter').value;
    newBetProperties.arbiterAddress = document.getElementById('arbiter-wallet').value;
    newBetProperties.arbiterFee = document.getElementById('arbiter-amount').value;

    return newBetProperties;
  },

  loadBet: function() {
    let bet = new Bet(App.contracts, App.ipfs, App.getBetFormValues());
    return bet;
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
