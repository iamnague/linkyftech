var cron = require('node-cron');
const fs = require('fs');
const date = require('date-and-time');

console.log('accessToken: ' + process.env.accessToken);
console.log('refreshToken: ' + process.env.refreshToken);
console.log('usagePointId: ' + process.env.usagePointId);


function FetchEnedis(){

const linky = require('linky');

// Créez une session
const session = new linky.Session({

    accessToken: process.env.accessToken,
    refreshToken:  process.env.refreshToken,
    usagePointId: process.env.usagePointId,
//    onTokenRefresh: (accessToken, refreshToken) => {

});

//cron.schedule('* * * * *', () => {
var today = new Date();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-arguments[0]);
today = date.format(today, 'YYYY-MM-DD');
yesterday  = date.format(yesterday, 'YYYY-MM-DD');

// Récupère la puissance moyenne consommée le 31 décembre 2021, sur un intervalle de 30 min
session.getLoadCurve(yesterday, today).then((result) => {
   fs.writeFile('linky_power.json', JSON.stringify(result, null, 2), function (err) {
      if (err) return console.log(err);
      console.log(new Date(), 'OK Power from ', yesterday);
      });

});

session.getDailyConsumption(yesterday, today).then((result) => {
   fs.writeFile('linky_conso.json', JSON.stringify(result, null, 2), function (err) {
      if (err) return console.log(err);
      console.log(new Date(), ' OK Conso from ',yesterday);
      });
});
}

FetchEnedis(7); //immediate execution

function scheduler (delay) {
cron.schedule("23 0-23/3 * * *", () => FetchEnedis(delay),{
   scheduled: true,
   timezone: "Europe/Paris"
 }); //periodically execution.
}

scheduler (1);
