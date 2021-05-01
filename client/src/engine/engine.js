/* eslint-disable */

//const firebase = require('firebase/app');
//require('firebase/database');

const firebase = require('firebase');

// const admin = require('firebase-admin'); need service account I think
// wanting to use admin to delete users

let prompt;
//  const prompt = require('prompt');

let queue_ = [];
let queue_working_ = false;
let app_;

const w = console.warn;

async function init() {
  if (app_)
    return app_;
  w("firebase.apps next");
  w(firebase.apps);
  var firebaseConfig = {
    apiKey: "AIzaSyDXY_JGPJQggvKNFcuMzgZRbOzlxz5nTV4",
    authDomain: "goodp5.firebaseapp.com",
    databaseURL: "https://goodp5-default-rtdb.firebaseio.com",
    projectId: "goodp5",
    storageBucket: "goodp5.appspot.com",
    messagingSenderId: "380175280675",
    appId: "1:380175280675:web:59b4df03723f2a64315f96"
  };
  app_ = firebase.initializeApp(firebaseConfig);
  w("app next");
  w(app_);
  w("firebase.apps next");
  w(firebase.apps);
  const auth = app_.auth();
  const db = firebase.database(app_);

  processQueue();
  return app_;
}

const CHAR_DELAY = 80;
const NUM_PLAYERS = 2; // 1 is broken
const QUESTION_TIME_SEC = 16;

let players_ = {};
let cb_, gameid_, state_, question_timer_, whosturn_;

// DPTEST causing trouble in browser somehow with duplicate apps getting created
// taking out for now
//init().then(app => {});

function makePlayer() {
  return {bal: 0}
}

function gameref(path) {
  return firebase.database().ref(`/games/${gameid_}/${path}`);
}

// ----------------------------------------------------------------------------
// Called whenever the question timer is changed, which happens on a new
// question coming out, and then every second while the timer counts down.
// The engine instance that starts the timer is also the one responsible for
// updating it every second. To know which engine is responsible, this uses
// the whosturn_ state variable.
//
// This function is called to install a handler for the question_timer event
// which is raised whenever a new question is asked and again every second
// thereafter until the turn concludes. It can be null such as when the game
// is first getting started but no questions have yet been asked.
//
// Sends event 'question_timer' with current timer value so UI can optionally
// display amount of time left to answer the question, and when this time
// reaches 0 it should disable the buzzin answer button.
//
// All players are given QUESTION_TIME_SEC to buzzin their answer. When this
// timer goes to 0 the engine starts judging answers from answerlist.
// ----------------------------------------------------------------------------

async function onQuestionTimer() {
  const ref = gameref('question_timer');
  ref.off();
  ref.on('value', data => {
    const val = data.val();
    if (val === 0) {
      if (cb_)
        cb_('question_time_out', null);
      if (whosturn_ == name_)
        judgeAnswers();
      return;
    }
    if (!val)
      return;
    if (cb_)
      cb_('question_timer', val);
    if (name_ == 'abc' && val == 14) buzzin('badbody');
    if (whosturn_ == name_) {
      if (val == 10)
        msg("You have 10 seconds left to buzzin your answer.");
      question_timer_ = setTimeout(_ => {
        // DPTEST for debug
        if (val == 12 && name_ == 'def') buzzin('body');
        if (val >= 0) ref.set(val - 1);
      }, 1000);
    }
  });
}

let firstJudge_ = true;

async function judgeAnswers() {
  let ref = gameref('answerlist');
  const snap = await ref.once('value')
  const entries = snap.val();

  ref = gameref('active_square');
  const active = (await ref.once('value')).val();
  const [topic, amt] = (await ref.once('value')).val();
  const fullquestion = questions_[topic][amt / 200 - 1];
  const win = fullquestion.w;
  let doneent = false;
  let doneans = false;
  await msg("Time's up.");
  switch (entries.length) {
  case 0:
    await msg("No players have buzzed in.");
    await msg(`Sorry, correct answer was ${fullquestion.a[0].q}`);
    await setWhosTurn(whosturn_);
    break;
  case 1:
    await msg(`Only player to buzz in, is ${entries[0].name}`);
    break;
  default:
    await msg(`${entries.length} players have buzzed in.`);
    if (firstJudge_) {
      await msg(`Player answers will now be checked in order.`);
      await msg(`First player with correct answer wins this round.`);
      firstJudge_ = false;
    }
    break;
  }
  for (var i = 0; i < entries.length && !doneent; ++i) {
    const answer = entries[i];
    await msg(`Player ${answer.name} has buzzed in with ${answer.answer}.`);
    for (var j = 0; j < fullquestion.a.length && !doneans; ++j) {
      let ans = fullquestion.a[j];
      if (ans.toLowerCase() === answer.answer.toLowerCase()) {
        await msg("That is correct!");
        await msg(`Player ${answer.name} wins ${win}.`);
        players_[answer.name].balance += win;
        const playersref = gameref('players');
        await playersref.set(players_);
        await msg(`Adjusting player ${answer.name} balance by + ${win}.`);
        setWhosTurn(answer.name);
        doneans = true;
        doneent = true;
        break;
      }
    }
    if (!doneans) {
      await msg("Sorry that is incorrect!");
      await msg(`Player ${answer.name} loses ${win}.`);
      players_[answer.name].balance -= win;
      const playersref = gameref('players');
      await playersref.set(players_);
      await msg(`Adjusting player ${answer.name} balance by - ${win}.`);
    }
  }
  if (!doneent) {
    await msg('No one got the correct answer!');
    const joined = fullquestion.a.join(', or ');
    if (fullquestion.a.length > 1)
      await msg(`The correct answer was any of ${joined}.`);
    else
      await msg(`The correct answer was ${joined}.`);
    const nm = leadPlayer();
    await msg(`${nm} you're in the lead with ${players_[nm].balance} dollars.`);
    setWhosTurn(nm);
  }
}

function leadPlayer() {
  let max = -1000000;
  let lead = null;
  for (var p in players_) {
    if (players_[p].balance > max) {
      max = players_[p].balance;
      lead = p;
    }
  }
  return lead;
}

// ----------------------------------------------------------------------------
// Installs the handler for fb callback to indicate a change in who's turn
// it is. This DOES NOT mean it is time to take a turn, it means, when it IS
// time to take a turn, this is who's turn it is. See also onTurnTime.
//
// Engine sets whosturn to empty string after each round, so that when it is
// then immediately set to the player of next turn, a state change event
// on this field is generated by fb and execution will land back in here to
// kick off the next round.
// ----------------------------------------------------------------------------

async function onWhosTurn() {
  const ref = gameref('whosturn');
  ref.off();
  ref.on('value', data => {
    whosturn_ = data.val();
    if (!whosturn_)
      return;
    if (cb_)
      cb_('whosturn', whosturn_);
    if (name_ != whosturn_)
      return;
    if (cb_)
      doRoundGUI();
    else
      doRoundConsole();
  });
}

async function doRoundGUI() {
/* DPTEST commented out until I figure out why topic and amt are undefined
  try {
    await dmsg(2, `Go ahead, your turn ${name_}`);
    await msg(`${name_} chooses ${topic} for ${amt}`); // NO these are undefined $topic $amt DPTEST
    await startQuestionTimer();
  }
  catch (e) {
    console.warn(e);
    await display(e);
    await doRoundGUI();
  }
*/
}

// ----------------------------------------------------------------------------
// DOes not send out the chooses msg until question has returned, meaning it
// did not throw, meaning topic and amt are valid.
// ----------------------------------------------------------------------------

async function doRoundConsole() {
  try {
    await dmsg(2, `Go ahead, your turn ${name_}`);
    const [topic, amt] = await askTopicAndAmt("Pick topic and amt separated by one space (eg Birds 400)");
    const q = await question(topic, amt);
    await msg(`${name_} chooses ${topic} for ${amt}`);
    await startQuestionTimer();
  }
  catch (e) {
    await display(e);
    await doRoundConsole();
  }
}

// ----------------------------------------------------------------------------
// Expects a callback function where all events will be reported.
// If no callback function is passed in, engine uses an internal default
// callback function and assumes it is running standalone on a terminal with
// with no browser driving it.
// ----------------------------------------------------------------------------

async function start(cb) {
  try {
    cb_ = cb;
    if (!app_)
      await init();
    if (!cb) {
      prompt.start();
      prompt.message = null;
      prompt.delimiter = "> ";
      const ready = await ask("Ready to play? (y/n) ");
      if (ready != "y") {
        await display("Sorry to hear that! Goodbye");
        return;
      }
      await display("Great! Let's get started..");
      await readyToPlay();
    }
    return {ready_to_play_fn: readyToPlay,
            pick_fn: question,
            buzzin_fn: buzzin};
  }
  catch (e) {
    w(e);
    display(e);
  }
}

// ----------------------------------------------------------------------------
// Called from UI to send in the player's attempt at an answer to the current
// question. This needs to tranact to fb so that the buzzin order across
// players can be captured for later judgement.
//
// Each answer in the answerlist is a 2-map of
// {name: PLAYER_NAME,
//  answer: ANSWER}
//  Checks to see if this player has already answered and if so logs a
//  warning and ignores the buzzin.
// ----------------------------------------------------------------------------

async function buzzin(answer) {
  let ref = gameref('answerlist');
  let result = await ref.transaction((aL) => {
    if (!aL) aL = [];
    for (let x of aL)
      if (x.name == name_)
        return;
    aL.push({answer, name: name_});
    return aL;
  });
}

// ----------------------------------------------------------------------------
// Installs the handler for fb callback to indicate that it is time to take
// a turn. Only the UI with name_ matching whosturn_ should be the one
// who enables to take a turn. See also onWhosTurn.
// ----------------------------------------------------------------------------
    
/* DPTEST later
async function onTurnTime(cb) {
  const ref = firebase.database().ref().child('/turntime');
  ref.off();
  ref.on('value', async data => {
    if (!cb && whosturn_ == name_) {
      const [topic, amt] = await engine.askTopicAndAmt("Enter your topic and amt separated by one space");
      engine.msg(`${myname_} chooses ${topic} for ${amt}`);

    whosturn_ = data.val() || {};
    if (cb) cb(whosturn_);
  });
}
*/

// ----------------------------------------------------------------------------
// Calls to nodejs server to get the questions for the game which right now
// are just hardcoded inside this file. Needs to be replaced with graphql
// call to nodejs server to get questions.
// ----------------------------------------------------------------------------

async function loadQuestions() {
  return questions_;
}

async function setQuestions(questions) {
  const ref = gameref('questions');
  await ref.set(questions);
}

// ----------------------------------------------------------------------------
// Installs the listener for player updates. UI needs player updates for
// balance updates after every round.
// ----------------------------------------------------------------------------

function onPlayers() {
  const ref = gameref('players');
  ref.on('value', data => {
    players_ = data.val() || {};
    if (cb_)
      cb_('players', players_);
  });
}

// ----------------------------------------------------------------------------
// Brought down locally on every update, but is not passed on to UI.
// If it was left on fb and not brought down event-driven, it still has to be
// brought down on every question, in order to determine if the question
// is open or closed, so just as well do it here at least for now.
// ----------------------------------------------------------------------------

function onQuestions() {
  const ref = gameref('questions');
  ref.on('value', data => {
    if (data.val())
      questions_ = data.val();
  });
}

function processQueue() {
  function f() {
    if (queue_.length) {
      queue_working_ = true;
      writeline(queue_.shift()).then(f);
      return;
    }
    else {
      queue_working_ = false;
      setTimeout(f, 1000);
    }
  }
  return new Promise(_ => f());
} 

async function writechar(c) {
  return new Promise(resolve => {
    process.stdout.write(c);
    setTimeout(() => {
      resolve();
    }, CHAR_DELAY);
  });
}

async function writechar_browser(c) {
  return new Promise(resolve => {
    let x = document.getElementById("guidance");
    if (x.value.length)
      x.value = x.value + c;
    else
      x.value = c;
    setTimeout(() => {
      resolve();
    }, CHAR_DELAY);
  });
}

async function writeline(str) {
  if (str == null)
    return;
  for (var i = 0; i < str.length; ++i)
    if (cb_)
      await writechar_browser(str.charAt(i));
    else
      await writechar(str.charAt(i));
  if (str.length)
    if (cb_)
      await writechar_browser('\n');
    else
      await writechar('\n');
}

// ----------------------------------------------------------------------------
// Writes the string str to the console with a delay between each character
// so that it more closely aligns with the cadence of speech.
// ----------------------------------------------------------------------------

async function display(str) {
  queue_working_ = true;
  queue_.push(str);
}

// ----------------------------------------------------------------------------
// Installs the listener for msg updates.
// ----------------------------------------------------------------------------

function onMsg(cb) {
  const ref = gameref('msg');
  ref.off();
  switch (cb) {
    case null:
    case undefined:
      ref.on('value', async data => {
        return await display(data.val());
      });
      break;
    default:
      ref.on('value', cb)
      break;
  }
}

function nullfunc() {
  return new Function();
}

function timeoutAsync(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

async function wait(n, f, ...args) {
  await timeoutAsync(n);
  return f(...args);
}

async function dmsg(n, str) {
  await timeoutAsync(n);
  await msg(str);
}

// ----------------------------------------------------------------------------
// For side effects only. The natural state of msg should be "", so after
// every write, that's what is written.
// ----------------------------------------------------------------------------

async function msg(str) {
  if (!gameid_)
    throw `msg: gameid_ null`;
  const ref = gameref('msg');
  await ref.set(str);
  await ref.set("");
}

function ask(question) {
  const properties = {
    properties: {
      answer : {
        description: question
      }
    }
  };
  function f(resolve) {
 		if (queue_working_)
			setTimeout(f, 2000, resolve);
		else {
			prompt.get(properties).then(x => { return resolve(x.answer); });
		}
  }
  return new Promise(f);
}

async function clearAnswerList() {
  const ref = gameref('answerList');
  ref.set(null);
}

async function askTopicAndAmt() {
  clearAnswerList();
  const topicAmt = await ask("Enter your topic and amt please separated by one space");
  return topicAmt.split(' ');
}

async function test() {
  const ref = firebase.database().ref().child('/players/abc');
  const snap = await ref.once('value');
  console.warn(snap.val());
}

// ----------------------------------------------------------------------------
// Must be called from readyToPlay for the instance of the engine that
// has hit the quorum of players.
// Goes to Redis and asks for the game board, which redis returns by selecting
// at random some topics and questions for each topic.
// when it comes back, it writes the topics to the fb topics vector. It then
// iterates these topics, and one by one flips the isVisible bit on them.
// This should trigger the UI to redraw that topic with the title of the topic
// now exposed instead of Navy blue. 
// ----------------------------------------------------------------------------

let questions_ = {
  "HTML": [{q: "Main content goes here.",
            a: ["body", "<body>"],
            open: false,
            w: 200},

           {q: "Main content goes here.",
            a: ["body", "<body>"],
            open: true,
            w: 400},

           {q: "Main content goes here.",
            a: ["body", "<body>"],
            open: true,
            w: 600},

           {q: "Main content goes here.",
            a: ["body", "<body>"],
            open: true,
            w: 800},

           {q: "Main content goes here.",
            a: ["body", "<body>"],
            open: true,
            w: 1000}],

  "CSS": [{q: "Class selectors start with this character",
           a: [".", "period", "dot"],
           open: true,
           w: 200},

          {q: "Class selectors start with this character",
           a: [".", "period", "dot"],
           open: true,
           w: 400},

          {q: "Class selectors start with this character",
           a: [".", "period", "dot"],
           open: true,
           w: 600},

          {q: "Class selectors start with this character",
           a: [".", "period", "dot"],
           open: true,
           w: 800},

          {q: "Class selectors start with this character",
           a: [".", "period", "dot"],
           open: true,
           w: 1000}]};

async function value(path) {
  const ref = gameref(path);
  const ds = await ref.once('value');
  return ds.val();
}

// ----------------------------------------------------------------------------
// Called by engine to close the question so that it is unavailable for
// selection again, meaning it just got used because some player selected it.
// ----------------------------------------------------------------------------

async function closeQuestion(topic, amt) {
  const questionref = gameref('questions').child(topic).child(amt / 200 - 1);
  await questionref.child('open').set(false);
}

// ----------------------------------------------------------------------------
// Not exppsed, this is a private function to the engine.
// ----------------------------------------------------------------------------

// DPTEST need to do validation on these args and throw something meaningul on each
// of topic wrong and amt wrong

function fullquestion(topic, amt) {
  amt = parseInt(amt);
  if (isNaN(amt))
    throw `amount is not a valid dollar value`;
  const _topic = questions_[topic];
  if (!_topic)
    throw `topic ${topic} is not valid`;
  return questions_[topic][amt / 200 - 1];
}

// ----------------------------------------------------------------------------
// The click of a topic/amount box on the game board should cause the UI to
// call this function. UI calls this to get the question so it can display
// the question to the user. Another way UI can call this function is off 
// a 'active_square' cb event, ie some other user whose turn it was, has
// made a call to *their* engine's question function. This other engine
// will set the active_square state in fb, which will result in an onState
// event to all engine instances. The question as string is returned. If
// the string is a URL the UI should treat it is a link to a video and play
// the video question.
// ----------------------------------------------------------------------------

async function question(topic, amt) {
  const x = fullquestion(topic, amt);
  if (!x)
    throw `invalid topic ${topic} or amt ${amt}`;
  if (!x.open)
    throw `question already played, no longer available ${topic} ${amt}`;
  if (gameid_ && whosturn_ == name_) {
    let ref = gameref('active_square');
    await closeQuestion(topic, amt);
    await ref.set([topic, amt]);
  }
  await msg("And the question is");
  await msg(x.q);
  return x.q;
}

async function revealTopics() {
  await dmsg(1, "Time to reveal today's topics.");
  const topics = Object.keys(questions_);
  if (cb_)
    cb_('topic_reveal_starts', topics.length);
  await msg(`We have ${topics.length} topics for our game.`);
  for (let i = 0; i < topics.length; ++i) {
    if (cb_)
      cb_('topic', [i, topics[i]]);
    await dmsg(1, `Topic is ${topics[i]}.`);
  }
  if (cb_)
    cb_('topic_reveal_ends', topics.length);
  await dmsg(1, 'All topics are now revealed!');
}

// ----------------------------------------------------------------------------
// See comments for onWhosTurn for why it is first set to empty string.
// ----------------------------------------------------------------------------

async function setWhosTurn(name) {
  await gameref('answerlist').set(null);
  await gameref('active_square').set(null);
  await gameref('whosturn').set("");
  let ref = await gameref('whosturn');
  await ref.set(name);
}

let name_ = null;

async function exists(path) {
  const ref = await firebase.database().ref().child(path);
  const snap = await ref.once('value');
  return !!snap.val();
}

// ----------------------------------------------------------------------------
// Name can optionally be passed in. The expectation is that when running
// this engine in a browser, optName will be passed in, and that the UI will
// first prompt the the name via a text box before calling readyToPlay.
//
// In console mode, optName should not be passed in, and readyToPlay will
// prompt the user to enter their name at that time.
//
// Should not pass in name here, it should be known via some other
// mechanism as the 'this' player. Also need to prohibit evil spaces
// in the name another reason I don't want it passed in here.
// And if you call this twice bad things will be sure to happen,
// the game will get confused and/or firebase will too.
//
// Creates a gameid on the first contestant to enroll, so that others as they
// come in to enroll, can learn what their gameid will be.
// ----------------------------------------------------------------------------

async function readyToPlay(optName) {
  name_ = optName || await ask("Enter your play name (one word only please, no spaces)");
  const user = await firebase.auth().signInAnonymously();
  let ref = firebase.database().ref('/enrolling');
  let enrollees; 
  let enrolled_count = 0;
  let result = await ref.transaction(enrolling => {
    try {
      if (!enrolling) {
        gameid_ = ref.push().key;
        installGameListeners();
        enrolled_count += 2;
        return ['gameid-' + gameid_, name_]; 
      }

      // This engine instance is not the first one enrolling for the new
      // game. This engine instance needs to learn of the new game
      // gameid.

      gameid_ = enrolling.filter(x => x.startsWith('gameid-'))[0];
      gameid_ = gameid_.replace('gameid-', '');
      if (enrolling.some(enrollingNm => enrollingNm == name_))
        return;
      installGameListeners();
      if (enrolling.length <= NUM_PLAYERS - 1) {
        enrolling.push(name_);
        ++enrolled_count;
        return enrolling;
      }
      enrolling.push(name_);
      enrollees = enrolling;
      return null;
    }
    catch (e) {
      console.warn(e);
    }
  });
  if (!result.committed) {
    await display(`Name ${name_} already in use, please try another name`);
    return await readyToPlay();
  }
  if (!enrollees) {
    await msg("Welcome " + name_ + "!");
    switch (enrolled_count) {
      case NUM_PLAYERS:
        await msg("You are the first contestant for a new enrolling game");
        await msg(`Waiting for ${NUM_PLAYERS - enrolled_count + 1} more to join..`);
        break;
      case NUM_PLAYERS + 1:
        await msg("You are the second contestant for a new enrolling game");
        await msg(`Waiting for ${NUM_PLAYERS - enrolled_count + 1} more to join..`);
        break;
      default:
        throw `enroll: mixup! ${NUM_PLAYERS} ${enrolled_count} ${name_}`;
    }
    return;
  }
  await msg("Welcome " + name_ + "!");
  const x = enrollees.reduce((rsf, ni) => {
    if (ni.startsWith('gameid'))
      return rsf;
    rsf[ni] = {balance: 0}
    return rsf;
  }, {});
  await firebase.database().ref('/games').child(gameid_).onDisconnect().set(null);
  await gameref('players').set(x);
  await setQuestions(await loadQuestions());
  await msg("We now have a quorum of players!");
  await dmsg(1, "Game will start momentarily..");
  await revealTopics();
  await setWhosTurn(name_);
  await closeQuestion('CSS', 1000);
}

// ----------------------------------------------------------------------------
// I don't know that there is an order-dependence to these.
// ----------------------------------------------------------------------------

async function installGameListeners() {
  onMsg();
  onPlayers();
  onQuestions();
  onQuestionTimer();
  onWhosTurn();
  setWhosTurn(null);
}

async function startQuestionTimer() {
  await gameref('question_timer').set(QUESTION_TIME_SEC);
}

async function signOut() {
  await app_.auth().signOut();
}

/*
async function handler(name, value) {
  switch (name) {
    case 'question_timer':
      break;
    default:
      //console.warn(`event: ${name} with value: ${JSON.stringify(value)}`);
      break;
  }
}

const engine = require('./engine');

process.on('SIGINT', () => {
  engine.signOut();
  process.exit(0);
});

async function main() {
  await engine.start();
//  await engine.signOut(); doesn't seem to help anything so just stay signed in
  //  so there are no surprises
}

main().then().catch(e => console.error(e));

//engine.test().then().catch(e => console.error(e));

*/

// nexttime when picking up where you last left off, there can be
// 2 players already in the rtdb, which means both engines
// will try to start the game above in case 2. What to do
// about that? perhaps I need to have a started state for the
// game in fb, I set to enrolling in my init method. Race condition
// is possibility though. When I call set against fb can it return
// the old value so I can know if I am the one who set the new
// state to "started" or not?

module.exports = {
  buzzin,
  onMsg,
  question,
  signOut,
  start,
  test
}
