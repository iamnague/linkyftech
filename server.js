var cron = require('node-cron');
const fs = require('fs');
const date = require('date-and-time');

var accessToken = process.env.accessToken;
var refreshToken =  process.env.refreshToken;
var usagePointId = process.env.usagePointId;

console.log('accessToken: ' + accessToken);
console.log('refreshToken: ' + refreshToken);
console.log('usagePointId: ' + usagePointId);

function FetchEnedis(){

const linky = require('linky');

// Créer une session
const session = new linky.Session({
    accessToken,
    refreshToken,
    usagePointId,
    onTokenRefresh: (accessToken, refreshToken) => {

         console.log('accessToken renew: ' + accessToken);
         console.log('refreshToken renew: ' + refreshToken);
    },
});

var today = new Date();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-arguments[0]);
today = date.format(today, 'YYYY-MM-DD');
yesterday  = date.format(yesterday, 'YYYY-MM-DD');

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
													  