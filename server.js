var cron = require('node-cron');
const fs = require('fs');
const date = require('date-and-time');
const linky = require('linky');

console.log('accessToken: ' + process.env.accessToken);
console.log('refreshToken: ' + process.env.refreshToken);
console.log('usagePointId: ' + process.env.usagePointId);


function FetchEnedis(){

const linky = require('linky');

const session = new linky.Session({

    accessToken: process.env.accessToken,
    refreshToken:  process.env.refreshToken,
    usagePointId: process.env.usagePointId,

});

var today = new Date();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1);
today = date.format(today, 'YYYY-MM-DD');
yesterday  = date.format(yesterday, 'YYYY-MM-DD');

session.getLoadCurve(yesterday, today).then((result) => {
   fs.writeFile('linky_power.json', JSON.stringify(result, null, 2), function (err) {
      if (err) return console.log(err);
      console.log('OK Power last day');
      });

});

session.getDailyConsumption(yesterday, today).then((result) => {
   fs.writeFile('linky_conso.json', JSON.stringify(result, null, 2), function (err) {
      if (err) return console.log(err);
      console.log('OK Conso last day');
      });
});
}

FetchEnedis(); //immediate execution

cron.schedule("35 8 * * *", FetchEnedis,{
   scheduled: true,
   timezone: "Europe/Paris"
 }); //periodically execution.

