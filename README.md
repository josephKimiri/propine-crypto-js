# propine-crypto-js
The project assumes you are a crypto investor and that you have made transactions over a period of time which are logged in a CSV file.

The program should run on the command line interface.

The program should: ~~ 

Given no parameters, it should return the latest portfolio value per token in USD. 


Given a token the program should return the latest portfolio value for that token in USD,



Given a date the program should return the portfolio value per token in USD on that date.


Given a date and a token, the program should return the portfolio value of that token in USD on that date.



# HOW TO RUN THE PROGRAM

1. Given a date and a token, return the portfolio value of that token in USD on that date

- node index.js --date=4/3/2018 --token=ETH

2. Given a date, return the portfolio value per token in USD on that date

- node .\fecthCyptoData.js --date=4/3/2018

3. Given a token, return the latest portfolio value for that token in USD

- node .\fecthCyptoData.js --token=BTC

4. Given no parameters, return the latest portfolio value per token in USD


- node .\fecthCyptoData.js




# Dependancies to install for the program to run

1. npm install yargs
2. npm install parser
3. npm install request
4. npm install await
5. npm install yargs
6. npm i date-and-time

# collaborators

- Zan(liangzan) - zan@propine.com,
- Kyle(kyled7)  - kyle.dinh@propine.com, 
- Thanh(thanhnpp) - thanh.nguyen@propine.com, 
- Viswanath(viswanathkgp12) - viswanathkapavarapu@propine.com.
