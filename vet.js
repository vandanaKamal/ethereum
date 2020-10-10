App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    return await App.initWeb3();
  },
  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('CowContract.json', function (data) {  //<VK>Satish to add his contract file here
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CMArtifact = data;
      App.contracts.CowContract = TruffleContract(CMArtifact);

      // Set the provider for our contract
      App.contracts.CowContract.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets

      //-------------start from here
      // return App.getCattle(); //call to get the desired data
    });
    return App.bindEvents();
  },

  bindEvents: function () {
    console.log("bind events")
    // $(document).on('click', '.btn-addCattle', App.updCattle); //<VK - bind all the button events>
    $(document).on('click', '.btn-getCattle', App.getCattle);
    $(document).on('click','.btn-getTrans',App.getTrans);
    $(document).on('click', '.verify-det', App.getCowDets);
    $(document).on('click', '.verify-app', App.approveCat);
    $(document).on('click', '.verify-rej', App.rejectCat);
  },
  getTrans:function(event){
    event.preventDefault();
       App.contracts.CowContract.deployed().then(function(instance) {
        adoptionInstance = instance;      
       return adoptionInstance.getAllTransaction.call();
      }).then(function(output) {
                    console.log(output);
                    console.log(output[1].length);
     var transRow = $('#transRow');
      var transTemplate = $('#transTemplate');
      //$('.btn-getTrans').hide();

      for (i = 0; i < output[0].length; i++) {
        transTemplate.find('.from').text(output[0][i]);
        transTemplate.find('.to').text(output[1][i]);
        transRow.append(transTemplate.html());
                      }

   
      }).catch(function(err) {
          console.log(err.message);
        });

  },
  rejectCat:function(event){
    event.preventDefault();

    alert("rejected")
  },

  approveCat: function (event) {
    event.preventDefault();

    var catId = $(event.target).data('id');
    console.log(catId);
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var vetVerified = true;
      App.contracts.CowContract.deployed().then(function (instance) {
        adoptionInstance = instance;
        return adoptionInstance.updateVetCowDets(vetVerified,catId, { from: account });
      }).then(function (output) {
        console.log(output);
    });
  });
  },
  getCowDets: function (event) {
    event.preventDefault();

    var catId = parseInt($(event.target).data('id'));
    console.log(catId);
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CowContract.deployed().then(function (instance) {
        adoptionInstance = instance;
        return adoptionInstance.getCowDetailsByUniqueidForHigherOfficals.call(catId, { from: account });
      }).then(function (output) {
        //console.log(output);
        var splitString = output[0].split(",");
        //console.log(splitString);
        //get Breed
        //var breedJson =splitString[0].split(":");
        // console.log(breedJson);
        // var breed = breedJson[1];
        //get Age
        //var dobJson =splitString[2].split(":");
        // console.log(dobJson);
        // var dob = dobJson[1];
        //healthCertificate
        var healthJson = splitString[3].split(":");
        // console.log(`health: ${healthJson}`);
        var healthParam = healthJson[1]
        console.log(healthParam);
        const Buffer = window.Ipfs.Buffer
        const ipfs = window.IpfsApi('100.126.225.7', 5001) // Connect to IPFS Server
        ipfs.cat(healthParam, function (err, files) {
          // if(err || !file) return console.error(err)
          // console.log(file._readableState.buffer);
          // console.log(Buffer(file));

          console.log(files);
          // console.log(files._readableState.buffer.head.data);
          window.open(files.url, '_blank')
        })
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  getCattle: function (event) {
    event.preventDefault();
    //getCattle: function(){
    console.log("call to get cattle")
    // event.preventDefault();   
    //var getUuid =  $("#updIdTxt").val();  
    // console.log(getUuid)
    var adoptionInstance;

    App.contracts.CowContract.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAllCowRegisteredUniqIdsForVet.call();
    }).then(function (output) {
      console.log(output);
      $('#results').html('Cattle Ids: ');
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');
      $('.btn-getCattle').hide();

      for (i = 0; i < output.length; i++) {
        //petTemplate.find('.pet-availFlag').text(data[i].availFlag);
        petTemplate.find('.verify-det').text(output[i]);
        petTemplate.find('.verify-det').attr('data-id', output[i]);
        petTemplate.find('.verify-app').attr('data-id', output[i]);
        petTemplate.find('.verify-rej').attr('data-id', output[i]);

        petsRow.append(petTemplate.html());
      }
    }).catch(function (err) {
      console.log(err.message);
      $('.btn-getCattle').hide();
      $('#results').html("Only Vets are allowed to view the health certificates");
    });

  },

  //CowContract.deployed().then(function(instance){return instance.getunqidByFarmer.call('0x30a8162a07b58a3517dd917a9af994444173bff6');}).then(function(value){return value.toString()});

};

$(function () {
  console.log("initiaing farmer")
  $(window).load(function () {
    App.init();
  });
});
