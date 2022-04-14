var request = require("request");
const args = require('yargs').argv;
const date = require('date-and-time');

var cryptoCompare;
var usdValues;

// function to get the latest portfolio value per token in USD
var getLatestValPerTokenInUSD = function () {
    return new Promise(function (resolve) {
        
        var output = [];

        var bitcoinOutputArray = { "token": "BTC", "amount": 0, "timestamp": 0 };
        var ethereumOutputArray = { "token": "ETH", "amount": 0, "timestamp": 0 };
        var xrpOutputArray = { "token": "XRP", "amount": 0, "timestamp": 0 };

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('transactions.csv')
        });

        lineReader.on('line', function (line) {

            var jsonFromLine = {};
            var lineSplit = line.split(',');

            jsonFromLine.timestamp = lineSplit[0];
            jsonFromLine.transaction_type = lineSplit[1];
            jsonFromLine.token = lineSplit[2];
            jsonFromLine.amount = lineSplit[3];

            if (jsonFromLine.token === 'ETH') {
                if (jsonFromLine.timestamp > ethereumOutputArray.timestamp) {
                    ethereumOutputArray.amount = jsonFromLine.amount;
                    ethereumOutputArray.timestamp = jsonFromLine.timestamp;
                }
            }
            else if (jsonFromLine.token === 'BTC') {

                if (jsonFromLine.timestamp > bitcoinOutputArray.timestamp) {
                    bitcoinOutputArray.amount = jsonFromLine.amount;
                    bitcoinOutputArray.timestamp = jsonFromLine.timestamp

                }
            }
            else if (jsonFromLine.token === 'XRP') {

                if (jsonFromLine.timestamp > xrpOutputArray.timestamp) {
                    xrpOutputArray.amount = jsonFromLine.amount;
                    xrpOutputArray.timestamp = jsonFromLine.timestamp;
                }
            }
        }

        );
        lineReader.on('close', function (line) {

            cryptoCompare = getUSDValues();

            cryptoCompare.then(function (result) {
                usdValues = result;
                ethereumOutputArray.amount = ethereumOutputArray.amount * usdValues.ETH.USD;
                bitcoinOutputArray.amount = bitcoinOutputArray.amount * usdValues.ETH.USD;
                xrpOutputArray.amount = xrpOutputArray.amount * usdValues.ETH.USD;

                output.push(ethereumOutputArray);
                output.push(bitcoinOutputArray);
                output.push(xrpOutputArray);
                resolve(output);
            }, function (err) {
                console.log(err);
            })

        });
    });
}
//function to get the portfolio value per token in USD
var getPortfolioValPerToken = function () {
    console.log("Get latest crypto || getPortfolioValPerToken");
    console.log("Date",args.date);
    return new Promise(function (resolve) {
        
        var output = [];

        var bitcoinOutputArray = [];
        var ethereumOutputArray = [];
        var xrpOutputArray = [];

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('transactions.csv')
        });

        lineReader.on('line', function (line) {

            var jsonFromLine = {};
            var lineSplit = line.split(',');

            jsonFromLine.timestamp = lineSplit[0];
            jsonFromLine.transaction_type = lineSplit[1];
            jsonFromLine.token = lineSplit[2];
            jsonFromLine.amount = lineSplit[3];

            //converting date from timestamp
            var d = new Date(jsonFromLine.timestamp * 1000);
            var dateFromCSV = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
            
                if(jsonFromLine.token === 'ETH'){
                    if(args.date === dateFromCSV){
                        ethereumOutputArray.push({"token":jsonFromLine.token,"amount":jsonFromLine.amount * usdValues.ETH.USD})
                    }
                } else if (jsonFromLine.token === 'BTC'){
    
                    if(args.date === dateFromCSV){
                        bitcoinOutputArray.push({"token":jsonFromLine.token,"amount":jsonFromLine.amount * usdValues.ETH.USD})
                    }
                }
                else if (jsonFromLine.token === 'XRP'){
    
                    if(args.date === dateFromCSV){
                        xrpOutputArray.push({"token":jsonFromLine.token,"amount":jsonFromLine.amount * usdValues.ETH.USD})
                    }
                }//end
        }

        )
    ;
        lineReader.on('close', function (line) {
                output.push(ethereumOutputArray);
                output.push(bitcoinOutputArray);
                output.push(xrpOutputArray);
                resolve(output);

        });
        
    });
}

// function to fetch the USD Values from CryptoCompare using their API
function getUSDValues() {

    var cryptoURL = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=a966ab80e0037c71376bbcc567e3f81a587e6f945d0794a5c285f31f905ce3c7';

    var options = {
        url: cryptoURL,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}

function filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof(obj[key] == "object")){
                var item = obj[key];
                if(item[prop] == value){
                    filtered.push(item);
                }
            }
        }

    }    

    return filtered;

}

// based on the type of the parameters we pass as cmd, corresponding function will be called
if(args.token === undefined && args.date === undefined){
    console.log("Given no parameters, return the latest portfolio value per token in USD");
  getLatestValPerTokenInUSD().then(function (result) { console.log(result); });
}
else if (args.token != undefined && args.date === undefined){
    console.log("Given a token, return the latest portfolio value for that token in USD");
    getLatestValPerTokenInUSD().then(function (result) { 
        var resultPerToken =  result.filter(function(record) {
            return record.token === args.token;
            })
            console.log(resultPerToken);
     });
}
else if (args.date != undefined && args.token === undefined){
    console.log("Given a date, return the portfolio value per token in USD on that date");
    cryptoCompare = getUSDValues();
    cryptoCompare.then(function (result) {
     usdValues = result;
     getPortfolioValPerToken().then(function (result) { console.log(result); });
 }, function (err) {
     console.log(err);
 })
    
}
else if (args.token != undefined && args.date != undefined){
    console.log("Given a date and a token, return the portfolio value of that token in USD on that date");
    cryptoCompare = getUSDValues();
    cryptoCompare.then(function (usdVal) {
    usdValues = usdVal;
     getPortfolioValPerToken().then(function (result) { 
         
        var resultPerToken =  filterByProperty(result,"token",args.token);
            console.log(resultPerToken); 
        });
 }, function (err) {
     console.log(err);
 })
}
