var express = require("express");
var knex = require("knex");
var jwt = require("jsonwebtoken");
var joi = require('joi');
var ee = require('events');
const {Router} = require("express");
const  initApi  = require( './src/api/api.js');
const  ENV =require( './src/common/enums/enums.js');
var dbConfig = require("./knexfile");
var app = express();

var port = 3000;

var statEmitter = new ee();
var stats = {
  totalUsers: 3,
  totalBets: 1,
  totalEvents: 1,
};

var db;
app.use(express.json());
// app.use((uselessRequest, uselessResponse, neededNext) => {
//   db = knex(dbConfig.development);
//   db.raw('select 1+1 as result').then(function () {
//     neededNext();
//   }).catch(() => {
//     throw new Error('No db connection');
//   });
// });
function conectDb(){
  try{
    db = knex(dbConfig.development);
    console.log("created Db");
    //console.log(db)
  }catch {
    throw new Error('No db connection');
  }
}
conectDb();
//   var schema = joi.object({
//     id: joi.string().uuid(),
//     type: joi.string().required(),
//     homeTeam: joi.string().required(),
//     awayTeam: joi.string().required(),
//     startAt: joi.date().required(),
//     odds: joi.object({
//       homeWin: joi.number().min(1.01).required(),
//       awayWin: joi.number().min(1.01).required(),
//       draw: joi.number().min(1.01).required(),
//     }).required(),
//   }).required();
//   var isValidResult = schema.validate(req.body);
//   if(isValidResult.error) {
//     res.status(400).send({ error: isValidResult.error.details[0].message });
//     return;
//   };
  
//   try {
//     let token = req.headers['authorization'];
//     if(!token) {
//       return res.status(401).send({ error: 'Not Authorized' });
//     }
//     token = token.replace('Bearer ', '');
//     try {
//       var tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
//       if (tokenPayload.type != 'admin') {
//         throw new Error();
//       }
//     } catch (err) {
//       return res.status(401).send({ error: 'Not Authorized' });
//     }


//     req.body.odds.home_win = req.body.odds.homeWin;
//     delete req.body.odds.homeWin;
//     req.body.odds.away_win = req.body.odds.awayWin;
//     delete req.body.odds.awayWin;
//     db("odds").insert(req.body.odds).returning("*").then(([odds]) => {
//       delete req.body.odds;
//       req.body.away_team = req.body.awayTeam;
//       req.body.home_team = req.body.homeTeam;
//       req.body.start_at = req.body.startAt;
//       delete req.body.awayTeam;
//       delete req.body.homeTeam;
//       delete req.body.startAt;
//       db("event").insert({
//         ...req.body,
//         odds_id: odds.id
//       }).returning("*").then(([event]) => {
//         statEmitter.emit('newEvent');
//         ['bet_amount', 'event_id', 'away_team', 'home_team', 'odds_id', 'start_at', 'updated_at', 'created_at'].forEach(whatakey => {
//           var index = whatakey.indexOf('_');
//           var newKey = whatakey.replace('_', '');
//           newKey = newKey.split('')
//           newKey[index] = newKey[index].toUpperCase();
//           newKey = newKey.join('');
//           event[newKey] = event[whatakey];
//           delete event[whatakey];
//         });
//         ['home_win', 'away_win', 'created_at', 'updated_at'].forEach(whatakey => {
//           var index = whatakey.indexOf('_');
//           var newKey = whatakey.replace('_', '');
//           newKey = newKey.split('')
//           newKey[index] = newKey[index].toUpperCase();
//           newKey = newKey.join('');
//           odds[newKey] = odds[whatakey];
//           delete odds[whatakey];
//         })
//         return res.send({ 
//           ...event,
//           odds,
//         });
//       })
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//     return;
//   }
// });

// app.post("/bets", (req, res) => {
//   var schema = joi.object({
//     id: joi.string().uuid(),
//     eventId: joi.string().uuid().required(),
//     betAmount: joi.number().min(1).required(),
//     prediction: joi.string().valid('w1', 'w2', 'x').required(),
//   }).required();
//   var isValidResult = schema.validate(req.body);
//   if(isValidResult.error) {
//     res.status(400).send({ error: isValidResult.error.details[0].message });
//     return;
//   };
  
//   let userId;
//   try {
//     let token = req.headers['authorization'];
//     if(!token) {
//       return res.status(401).send({ error: 'Not Authorized' });
//     }
//     token = token.replace('Bearer ', '');
//     try {
//       var tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
//       userId = tokenPayload.id;
//     } catch (err) {
//       console.log(err);
//       return res.status(401).send({ error: 'Not Authorized' });
//     }


//     req.body.event_id = req.body.eventId;
//     req.body.bet_amount = req.body.betAmount;
//     delete req.body.eventId;
//     delete req.body.betAmount;
//     req.body.user_id = userId;
//     db.select().table('user').then((users) => {
//       var user = users.find(u => u.id == userId);
//       if(!user) {
//         res.status(400).send({ error: 'User does not exist'});
//         return;
//       }
//       if(+user.balance < +req.body.bet_amount) {
//         return res.status(400).send({ error: 'Not enough balance' });
//       }
//       db('event').where('id', req.body.event_id).then(([event]) => {
//         if(!event) {
//           return res.status(404).send({ error: 'Event not found' });
//         }
//         db('odds').where('id', event.odds_id).then(([odds]) => {
//           if(!odds) {
//             return res.status(404).send({ error: 'Odds not found' });
//           }
//           let multiplier;
//           switch(req.body.prediction) {
//             case 'w1':
//               multiplier = odds.home_win;
//               break;
//             case 'w2':
//               multiplier = odds.away_win;
//               break;
//             case 'x':
//               multiplier = odds.draw;
//               break;
//           }
//           db("bet").insert({
//             ...req.body,
//             multiplier,
//             event_id: event.id
//           }).returning("*").then(([bet]) => {
//             var currentBalance = user.balance - req.body.bet_amount;
//             db('user').where('id', userId).update({
//               balance: currentBalance,
//             }).then(() => {
//               statEmitter.emit('newBet');
//               ['bet_amount', 'event_id', 'away_team', 'home_team', 'odds_id', 'start_at', 'updated_at', 'created_at', 'user_id'].forEach(whatakey => {
//                 var index = whatakey.indexOf('_');
//                 var newKey = whatakey.replace('_', '');
//                 newKey = newKey.split('')
//                 newKey[index] = newKey[index].toUpperCase();
//                 newKey = newKey.join('');
//                 bet[newKey] = bet[whatakey];
//                 delete bet[whatakey];
//               });
//               return res.send({ 
//                 ...bet,
//                 currentBalance: currentBalance,
//               });
//             });
//           });
//         });
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//     return;
//   }
// });

// app.put("/events/:id", (req, res) => {
//   var schema = joi.object({
//     score: joi.string().required(),
//   }).required();
//   var isValidResult = schema.validate(req.body);
//   if(isValidResult.error) {
//     res.status(400).send({ error: isValidResult.error.details[0].message });
//     return;
//   };
  
//   try {
//     let token = req.headers['authorization'];
//     if(!token) {
//       return res.status(401).send({ error: 'Not Authorized' });
//     }
//     token = token.replace('Bearer ', '');
//     try {
//       var tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
//       if (tokenPayload.type != 'admin') {
//         throw new Error();
//       }
//     } catch (err) {
//       console.log(err);
//       return res.status(401).send({ error: 'Not Authorized' });
//     }


//     var eventId = req.params.id;
//     console.log(eventId);
//     db('bet').where('event_id', eventId).andWhere('win', null).then((bets) => {
//       var [w1, w2] = req.body.score.split(":");
//       let result;
//       if(+w1 > +w2) {
//         result = 'w1'
//       } else if(+w2 > +w1) {
//         result = 'w2';
//       } else {
//         result = 'x';
//       }
//       db('event').where('id', eventId).update({ score: req.body.score }).returning('*').then(([event]) => {
//         Promise.all(bets.map((bet) => {
//           if(bet.prediction == result) {
//             db('bet').where('id', bet.id).update({
//               win: true
//             });
//             db('user').where('id', bet.user_id).then(([user]) => {
//               return db('user').where('id', bet.user_id).update({
//                 balance: user.balance + (bet.bet_amount * bet.multiplier),
//               });
//             });
//           } else if(bet.prediction != result) {
//             return db('bet').where('id', bet.id).update({
//               win: false
//             });
//           }
//         }));
//         setTimeout(() => {
//           ['bet_amount', 'event_id', 'away_team', 'home_team', 'odds_id', 'start_at', 'updated_at', 'created_at'].forEach(whatakey => {
//             var index = whatakey.indexOf('_');
//             var newKey = whatakey.replace('_', '');
//             newKey = newKey.split('')
//             newKey[index] = newKey[index].toUpperCase();
//             newKey = newKey.join('');
//             event[newKey] = event[whatakey];
//             delete event[whatakey];
//           });
//           res.send(event);
//         }, 1000)
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//     return;
//   }
// });

// app.get("/stats", (req, res) => {
//   try {
//     let token = req.headers['authorization'];
//     if(!token) {
//       return res.status(401).send({ error: 'Not Authorized' });
//     }
//     token = token.replace('Bearer ', '');
//     try {
//       var tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
//       if (tokenPayload.type != 'admin') {
//         throw new Error();
//       }
//     } catch (err) {
//       return res.status(401).send({ error: 'Not Authorized' });
//     }
//     res.send(stats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//     return;
//   }
// });
app.use(ENV.APP.API_PATH, initApi(Router, db,statEmitter, stats));
app.listen(port, () => {
  statEmitter.on('newUser', () => {
    stats.totalUsers++;
  });
  statEmitter.on('newBet', () => {
    stats.totalBets++;
  });
  statEmitter.on('newEvent', () => {
    stats.totalEvents++;
  });

  console.log(`App listening at http://localhost:${port}`);
});

// Do not change this line
module.exports = { app };