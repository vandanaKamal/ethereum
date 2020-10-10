App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
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
 
  initContract: function() {
      $.getJSON('CowContract.json', function (data) {  //<VK>Satish to add his contract file here
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var CMArtifact = data;
        App.contracts.CowContract = TruffleContract(CMArtifact);
  
        // Set the provider for our contract
        App.contracts.CowContract.setProvider(App.web3Provider);
  
        // Use our contract to retrieve and mark the adopted pets

        //-------------start from here
       return App.getBuyersId(); //call to get the desired data
      });
      return App.bindEvents();
    },

  bindEvents: function() {
      console.log("bind events")
    $(document).on('click', '.btn-addCattle', App.addCattle); //<VK - bind all the button events>
    $(document).on('click', '.btn-getCattle', App.getCattle);
    $(document).on('click', '.btn-buyCattle', App.buyCattle);
    $(document).on('click', '.btn-start', App.startAuction);
    $(document).on('click', '.btn-part', App.Bid);
    $(document).on('click', '.btn-end', App.endAuction);
    $(document).on('click', '.btn-updCattle', App.updCattle);
    $(document).on('click', '.btn-transferCattle', App.transferCattle);
    $(document).on('click','.btn-getTrans',App.getTrans);
    $(document).on('click','.btn-sellCattle',App.sellCattle);
    $(document).on('click','.btn-postreqSellCow',App.postreqSellCow); //prcSellMilk
    $(document).on('click','.btn-startMilk',App.startAuctionMilk);
    $(document).on('click','.btn-endMilk',App.endAuctionMilk);
  },

  getTrans:function(event){
    event.preventDefault();
    
       App.contracts.CowContract.deployed().then(function(instance) {
        adoptionInstance = instance;      
       return adoptionInstance.getPrivateTransaction.call();
      }).then(function(output) {
                    console.log(output);
                    console.log(output[1].length);
     var transRow = $('#transRow');
      var transTemplate = $('#transTemplate');
      //$('.btn-getTrans').hide();
      if(output[0].length == 0){
        alert("No transactions to Display");
      }

      for (i = 0; i < output[0].length; i++) {
        transTemplate.find('.from').text(output[0][i]);
        transTemplate.find('.to').text(output[1][i]);
        transRow.append(transTemplate.html());
                      }

   
      }).catch(function(err) {
          console.log(err.message);
        });
     
  },

   
  addCattle: function(event) {
      console.log("call to add cattle")
    event.preventDefault();
    var selectedText = document.getElementById("breedAddCattle");
    var catBreed = selectedText.options[selectedText.selectedIndex].text;
    console.log(catBreed)
    var catAge = parseInt($("#ageAddCat").val());
    var catDob = $("#dobAddCat").val();
    //var healthcert = $("#addHlthcrt").val();
    //var uuid = $('#idAddCat').val();
   
    //console.log(details);           
   //var checkVal = $("#healthAddCat1").is(':checked');
     var dbtc=$("input[name='dbtc']:checked").val(); 
     var dobCatCalf = $("#dobCatCalf").val();
      //var CowUniqueid = $("#Cow-Unique-id").val();
/* var healthcert = $("#healthAddCat1").val() +'='+ $("#healthAddCat1").is(':checked') +"|" + $("#healthAddCat2").val() +'='+ $("#healthAddCat2").is(':checked')
                        +"|"  + $("#healthAddCat3").val() +'='+ $("#healthAddCat3").is(':checked') +"|"+ $("#healthAddCat4").val() +'='+ $("#healthAddCat4").is(':checked');
           
      //var AboutCowDesc = $("#Short-Cow-Desc").val();
      var ipfsHash = "not-available";
      var doc = new jsPDF()
      var docName = 'HealthCertificate'+Date.now()+'.pdf'
      doc.text(20,20,'Breed : ' + catBreed )
      doc.text(20,30, ' Date of Birth : ' + catDob )
      doc.text(20,40,' Given Birth to calf : ' +dbtc )
      doc.text(20,50,'Vaccination Details: ');
      doc.text(20,60,$("#healthAddCat1").val() +'='+ $("#healthAddCat1").is(':checked'));
      doc.text(20,70,$("#healthAddCat2").val() +'='+ $("#healthAddCat2").is(':checked'));
      doc.text(20,80,$("#healthAddCat3").val() +'='+ $("#healthAddCat3").is(':checked'));
      doc.text(20,90,$("#healthAddCat4").val() +'='+ $("#healthAddCat4").is(':checked'));
 
      doc.save(docName) */

// const utility=require('../index');

      //console.log("creating user on eth for", CowUniqueid, CowHealth, AboutCowDesc, ipfsHash);


    var IpfsHash ;
    console.log("calling upload method")
         const reader = new FileReader();
         //console.log("reader: ",reader);
         const Buffer = window.Ipfs.Buffer
         //console.log("Buffer: ",Buffer);
         reader.onload = function () {
            const ipfs = window.IpfsApi('100.126.225.7', 5001) // Connect to IPFS Server
            const buf = Buffer.from(reader.result) // Convert data into buffer reader
            //  console.log("Buffer"+buf)
            ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS server
               if (err) {
                  console.error(err)
                  return
               }
                IpfsHash = `${result[0].hash}`;
               console.log(`IPFS Hash --> ${IpfsHash}`)
               //var selectedText = document.getElementById("breedAddCattle");
              // var catBreed = selectedText.options[selectedText.selectedIndex].text;
              // console.log(catBreed)
              // var catAge = parseInt($("#ageAddCat").val());
              // var catDob = $("#dobAddCat").val();
               //var healthcert = $("#addHlthcrt").val();
              // var uuid = $('#idAddCat').val();
              
               //console.log(details);           
              //var checkVal = $("#healthAddCat1").is(':checked');
              //var dbtc=$("input[name='dbtc']:checked").val(); 
              //var dobCatCalf = $("#dobCatCalf").val();
              //console.log(uuid);
              var details='{Breed:'+catBreed+',Age:'+catAge+',Dob:'+catDob+',healthCert:'+IpfsHash+',gbtc:'+dbtc+',gbtcDt:'+dobCatCalf+',dod:null}';
              //console.log(details);  
           
               //var dbtc = "yes";
               //var dod = "";
           
               //console.log(catAge);
           
               web3.eth.getAccounts(function(error, accounts) {  
                 if (error) {
                   console.log(error);
                 }
               
                 var account = accounts[0];
                 console.log(details,account);
               
                 App.contracts.CowContract.deployed().then(function(instance) {
                   adoptionInstance = instance;   
                   //string memory details, uint unqid,address owner   
                  //return adoptionInstance.registerCow(details,uuid,account,{from: account});
                  return adoptionInstance.registerCow(details,account,{from: account});
                 }).then(function(output) {
                   console.log(output);
                   //console.log(output.logs[0].args.unqid.c[0]);
                   $('#error').hide();
                   $('#results').show();
                   $('#results').html('Cattle Id: '+output.logs[0].args.unqid.c[0]);
                 }).catch(function(err) {
                   $('#error').show();
                   $('#results').hide();
                   $('#error').html("Only Farmers can add cattle");
                 });
               });
               //document.getElementById("IpfsHashData").innerHTML = `${IpfsHash}`
            })

         }
         
         reader.readAsArrayBuffer(certificate.files[0]); // Read Provided File

    //var petId = parseInt($(event.target).data('id'));

  },
  transferCattle: function(event) {
    event.preventDefault();
    console.log("call to transfer money and cattle")
  

    var amount = parseInt($("#amount").val());
    var sellerId = $("#seller").val();
    var buyerId = $("#buyer").val();
    var uuid = $('#uniqueid').val();
    //var txnhash = web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1], value: web3.toWei("50","ether")});
  //var txnhash = web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1] ], gas:1], gasPrice:1, value: web3.toWei("1","ether")});
    //console.log(catAge);
  //contractInstance.methods.mymethod(param).send({from: address, value: web3.utils.toWei( value, 'ether')})



    //view-source:https://www.mobilefish.com/download/ethereum/web3api.html

    web3.eth.getAccounts(function(error, accounts) {  
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      //var account = accounts[0];
      var adoptionInstance;
      console.log(sellerId,buyerId,uuid,amount);

      App.contracts.CowContract.deployed().then(function(instance) {
        
        adoptionInstance = instance;  
          //var details='test';
       return adoptionInstance.transferCow(sellerId,buyerId,uuid,{from: account});

      }).then(function(output) {

        console.log(output);

        $('#results').html('Cattle Id: '+uuid);

      }).catch(function(err) {

        console.log(err.message);

      });

    });

  },

  //updatecatthe
  updCattle:function(event){
    event.preventDefault();
    var updFile = false;
    var getUuid =  $("#updIdTxt").val();  
    App.contracts.CowContract.deployed().then(function(instance) {
      adoptionInstance = instance;      
     return adoptionInstance.getCowDetailsByUniqueid(getUuid);
    }).then(function(output) {
        console.log(output)
        var splitString = output[0].split(",");
      console.log(splitString);
      var dbtc=$("input[name='updDbtc']:checked").val();
      var gbtc = splitString[4].split(':');
      gbtc[1] = dbtc;
      splitString[4] = gbtc[0]+':'+gbtc[1];
      
       console.log("$(#dobUpdCalf).val(): "+$("#dobUpdCalf").val())
      if($("#dobUpdCalf").val() != "")
      {
        gbtcDt=splitString[5].split(":")
     var dobCatCalf = $("#dobUpdCalf").val();
     gbtcDt[1]=dobCatCalf;
     splitString[5]=gbtcDt[0]+':'+gbtcDt[1];
    }
    if($("#dodUpdCat").val() != "")
      {
      
     var dobCatCalf = $("#dodUpdCat").val();
     dod=splitString[6].split(':');
     dod[1]=dobCatCalf;
     splitString[6]=dod[0]+':'+dod[1]+'}';
    }
    //console.log("certificate.files[0]: "+certificateUpd.files[0])
    if(certificateUpd.files[0]!= undefined)
    {
      updFile =true;
      fileHash = splitString[3].split(':');
      console.log("in file");
      var IpfsHash ;
    console.log("calling upload method")
         const reader = new FileReader();
         //console.log("reader: ",reader);
         const Buffer = window.Ipfs.Buffer
         //console.log("Buffer: ",Buffer);
         reader.onload = function () {
            const ipfs = window.IpfsApi('100.126.225.7', 5001) // Connect to IPFS Server
            const buf = Buffer.from(reader.result) // Convert data into buffer reader
            //  console.log("Buffer"+buf)
            ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS server
               if (err) {
                  console.error(err)
                  return
               }
                IpfsHash = `${result[0].hash}`;
               console.log(`IPFS Hash --> ${IpfsHash}`)
              splitString[3]=fileHash[0]+':'+IpfsHash;
              web3.eth.getAccounts(function(error, accounts) {  
                if (error) {
                  console.log(error);
                }
              
                var details= splitString[0]+','+splitString[1]+','+splitString[2]+','+splitString[3]+','+splitString[4]+','+splitString[5]+','+splitString[6]
                //console.log(details); 
  
                var account = accounts[0];
                console.log(details,account);
              
                App.contracts.CowContract.deployed().then(function(instance) {
                  adoptionInstance = instance;   
                  //string memory details, uint unqid,address owner   
                 //return adoptionInstance.registerCow(details,uuid,account,{from: account});
                 return adoptionInstance.updateCowDetails(details,getUuid,{from: account});
                }).then(function(output) {
                  console.log(output);
                  //console.log(output.logs[0].args.unqid.c[0]);
                  $('#errorU').hide();
                  $('#resultsU').show();
                  $('#resultsU').html('cattle updated successfully');
                }).catch(function(err) {
                  $('#errorU').show();
                  $('#resultsU').hide();
                  $('#errorU').html("Only Farmers can add cattle");
                });
              });
              }
               
            )}
            reader.readAsArrayBuffer(certificateUpd.files[0]); // Read Provided File */

       
    }
    

    if (!updFile)
    {

      web3.eth.getAccounts(function(error, accounts) {  
        if (error) {
          console.log(error);
        }
      
        var details= splitString[0]+','+splitString[1]+','+splitString[2]+','+splitString[3]+','+splitString[4]+','+splitString[5]+','+splitString[6]
        //console.log(details); 

        var account = accounts[0];
        console.log(details,account);
      
        App.contracts.CowContract.deployed().then(function(instance) {
          adoptionInstance = instance;   
          //string memory details, uint unqid,address owner   
         //return adoptionInstance.registerCow(details,uuid,account,{from: account});
         return adoptionInstance.updateCowDetails(details,getUuid,{from: account});
        }).then(function(output) {
          console.log(output);
          //console.log(output.logs[0].args.unqid.c[0]);
          $('#errorU').hide();
          $('#resultsU').show();
          $('#resultsU').html('cattle updated successfully');
        }).catch(function(err) {
          $('#errorU').show();
          $('#resultsU').hide();
          $('#errorU').html("Only Farmers can add cattle");
        });
      });
      
    }
 
    })

    

               
               //document.getElementById("IpfsHashData").innerHTML = `${IpfsHash}`
        
         

  },
  
//getCattle: function(event) {
//  event.preventDefault();
getCattle: function(event){
  console.log("call to get cattle")
  event.preventDefault();   
  var getUuid =  $("#updIdTxt").val();  
  console.log(getUuid)

  App.contracts.CowContract.deployed().then(function(instance) {
    adoptionInstance = instance;      
   return adoptionInstance.getCowDetailsByUniqueid(getUuid);
  }).then(function(output) {
      var splitString = output[0].split(",");
      console.log(splitString);
      //get Breed
      var breedJson =splitString[0].split(":");
      console.log(breedJson);
      var breed = breedJson[1];
      //get Age
      var dobJson =splitString[2].split(":");
      console.log(dobJson);
      var dob = dobJson[1];
      //healthCertificate
      var healthJson=splitString[3].split(":");
      console.log(healthJson);
      var healthParam=healthJson[1].split("|");
      console.log(healthParam.length);
      //
      console.log(breed);
      console.log(output);
      $('#ageUpdBreed').val(breed);
      
        
      
     
      //$('#results').html('Cattle Id: '+uuid);
    }).catch(function(err) {
      console.log(err.message);
    });
},
startAuction: function(event){
console.log("call to start auction")
event.preventDefault();   
var getUuid =  $("#aucIdTxt").val(); 
var duration =  ($("#aucSart").val())*60;
console.log(duration);
// var valueAmt = $("#aucAmt").val()

// console.log(getUuid)

web3.eth.getAccounts(function(error, accounts) {  
  if (error) {
    console.log(error);
  }

  var account = accounts[0];
  var valueAmt = web3.toBigNumber($("#aucAmt").val());
  var weiValue = web3.toWei(valueAmt,'ether');
 console.log(weiValue);

  App.contracts.CowContract.deployed().then(function(instance) {
    adoptionInstance = instance;      
   return adoptionInstance.StartAuction(duration,account, weiValue,getUuid,{from:account});
  }).then(function(output) {
    console.log(output);
   //$('#ageUpdBreed').val(breed);
   //$('#results').html('Cattle Id: '+uuid);
  }).catch(function(err) {
    console.log(err.message);
  });
});
},
endAuction: function(event){
console.log("call to end auction")
event.preventDefault();   
//var duration =  ($("#aucSart").val())*60;
//console.log(duration);
// var valueAmt = $("#aucAmt").val()

// console.log(getUuid)

web3.eth.getAccounts(function(error, accounts) {  
  if (error) {
    console.log(error);
  }
  var account = accounts[0];
 
  App.contracts.CowContract.deployed().then(function(instance) {
    adoptionInstance = instance;      
   return adoptionInstance.auctionEnd({from:account});
  }).then(function(output) {
    console.log(output);
   //$('#ageUpdBreed').val(breed);
   //$('#results').html('Cattle Id: '+uuid);
  }).catch(function(err) {
    console.log(err.message);
  });
});
},
Bid: function(event){
console.log("call to bid auction")
event.preventDefault();   
web3.eth.getAccounts(function(error, accounts) {  
  if (error) {
    console.log(error);
  }

  var account = accounts[0];
  var valueAmt = web3.toBigNumber($("#bidAmt").val());
  var weiValue = web3.toWei(valueAmt,'ether');
 console.log(weiValue);

  App.contracts.CowContract.deployed().then(function(instance) {
    adoptionInstance = instance;      
   return adoptionInstance.bid(weiValue,{from:account, value: weiValue});
  }).then(function(output) {
    console.log(output);
   //$('#ageUpdBreed').val(breed);
   //$('#results').html('Cattle Id: '+uuid);
  }).catch(function(err) {
    console.log(err.message);
  });
});
},

startAuctionMilk: function(event){
  console.log("call to start auction")
  event.preventDefault();   
  var getUuid =  $("#aucMilkTxt").val(); 
  var duration =  ($("#aucMilkSart").val())*60;
  console.log(duration);
  // var valueAmt = $("#aucAmt").val()
  
  // console.log(getUuid)
  
  web3.eth.getAccounts(function(error, accounts) {  
    if (error) {
      console.log(error);
    }
  
    var account = accounts[0];
    var valueAmt = web3.toBigNumber($("#aucMilkAmt").val());
    var weiValue = web3.toWei(valueAmt,'ether');
   console.log(weiValue);
  
    App.contracts.CowContract.deployed().then(function(instance) {
      adoptionInstance = instance;      
     return adoptionInstance.StartAuctionMilk(duration,account, weiValue,getUuid,{from:account});
    }).then(function(output) {
      console.log(output);
     //$('#ageUpdBreed').val(breed);
     //$('#results').html('Cattle Id: '+uuid);
    }).catch(function(err) {
      console.log(err.message);
    });
  });
  },
  endAuctionMilk: function(event){
  console.log("call to end auction")
  event.preventDefault();   
  //var duration =  ($("#aucSart").val())*60;
  //console.log(duration);
  // var valueAmt = $("#aucAmt").val()
  
  // console.log(getUuid)
  
  web3.eth.getAccounts(function(error, accounts) {  
    if (error) {
      console.log(error);
    }
    var account = accounts[0];
   
    App.contracts.CowContract.deployed().then(function(instance) {
      adoptionInstance = instance;      
     return adoptionInstance.auctionEndMilk({from:account});
    }).then(function(output) {
      console.log(output);
     //$('#ageUpdBreed').val(breed);
     //$('#results').html('Cattle Id: '+uuid);
    }).catch(function(err) {
      console.log(err.message);
    });
  });
  },
  

buyCattle: function(event) {
console.log("call to buy cattle")
event.preventDefault();

var qtyBuyCat = $("#qtyBuyCat").val();
var prcBuyCat=$("#prcBuyCat").val();

var details=$('#buyDetails').val();
console.log(details);  

web3.eth.getAccounts(function(error, accounts) {  
if (error) {
  console.log(error);
}

var account = accounts[0];

console.log(qtyBuyCat,details,prcBuyCat)
App.contracts.CowContract.deployed().then(function(instance) {
  adoptionInstance = instance;   
  //uint advtId,string memory digitalid, uint qty,string memory details,address buyeraddr,uint offerprice  
 return adoptionInstance.postRequirementToBuyCow(qtyBuyCat,details,prcBuyCat,{from:account});
}).then(function(output) {
  console.log(output);
  $('#resultsB').html("Advt ID: "+output.logs[0].args.unqid.c[0]);
}).catch(function(err) {
  console.log(err.message);
});
});
},
postreqSellCow: function(event) {
  console.log("call to sell milk")
  event.preventDefault();
  
  var qtyBuyCat = $("#qtySellMilk").val();
  var prcBuyCat=$("#prcSellMilk").val();
  
  var details=$('#sellMilkDetails').val();
  console.log(details);  
  
  web3.eth.getAccounts(function(error, accounts) {  
  if (error) {
    console.log(error);
  }
  
  var account = accounts[0];
  
  console.log(qtyBuyCat,details,prcBuyCat)
  App.contracts.CowContract.deployed().then(function(instance) {
    adoptionInstance = instance;   
    //uint advtId,string memory digitalid, uint qty,string memory details,address buyeraddr,uint offerprice  
   return adoptionInstance.postRequirementToSellMilk(qtyBuyCat,details,prcBuyCat,{from:account});
  }).then(function(output) {
    console.log(output);
    $('#resultsSM').html("Advt ID: "+output.logs[0].args.unqid.c[0]);
  }).catch(function(err) {
    console.log(err.message);
  });
  });
  },
sellCattle: function(event) {
  console.log("call to sell cattle")
  event.preventDefault();
  
  var qtyBuyCat = $("#qtySellCat").val();
  var prcBuyCat=$("#prcSellCat").val();
  
  var details=$('#sellDetails').val();
  console.log(details);  
  
  web3.eth.getAccounts(function(error, accounts) {  
  if (error) {
    console.log(error);
  }
  
  var account = accounts[0];
  
  console.log(qtyBuyCat,details,prcBuyCat)
  App.contracts.CowContract.deployed().then(function(instance) {
    adoptionInstance = instance;   
    //uint advtId,string memory digitalid, uint qty,string memory details,address buyeraddr,uint offerprice  
   return adoptionInstance.postRequirementToSellCow(qtyBuyCat,details,prcBuyCat,{from:account});
  }).then(function(output) {
    console.log(output);
    $('#resultsSC').html("Advt ID: "+output.logs[0].args.unqid.c[0]);
  }).catch(function(err) {
    console.log(err.message);
  });
  });
  },
getBuyersId: function(adopters, account) {
var adoptionInstance;

App.contracts.CowContract.deployed().then(function (instance) {
  adoptionInstance = instance;

  return adoptionInstance.getCowBuyersAds.call(10000);
}).then(function (adopters) {
  console.log(adopters);
}).catch(function (err) {
  console.log(err.message);
});
},

};

$(function() {
    console.log("initiaing farmer")
  $(window).load(function() {
    App.init();
  });
});
