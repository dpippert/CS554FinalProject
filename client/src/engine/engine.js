/* eslint-disable */

//const firebase = require('firebase/app');
//require('firebase/database');

const firebase = require('firebase');
const config = require('../config');

// const admin = require('firebase-admin'); need service account I think
// wanting to use admin to delete users

let prompt;
//  const prompt = require('prompt');

let queue_ = [];
let queue_working_ = false;
let synth_;
let zira_;
let voices_;

const w = console.debug;

const APP_NAME = "tempest";

function isBrowser() {
  return typeof window !== 'undefined';
}

async function tell(evName, evObj) {
  if (cb_)
    await cb_(evName, evObj);
}

function app() {
  let x = firebase.apps.filter(a => a.name === APP_NAME);
  if (!x.length) {
    let app = firebase.initializeApp(config.firebase, APP_NAME);
    auth = app.auth();
    return app;
  }
  return firebase.app(APP_NAME);
}

function db() {
  return firebase.database(app());
}

let initCount_ = 0;

function init() {
  // REVISIT this will cause compile error under nodejs, will need to
  // move to a separate file and try requiring it, or eval a string.
  // won't work in the face of body element changes, maybe body is stable though

  /*
  if (isBrowser()) {
    const x = document.getElementsByTagName('body')[0];
    w("adding event listener for sign out");
    x.addEventListener('onunload', _ => {
      alert("will sign out");
      w("will sign out");
      signOut();
    });
  }
  */

  if (++initCount_ >= 2)
    console.error(`Too many inits of ${initCount_}`);
  else
    processQueue();
}

const TTS_ENABLED = false;
const CHAR_DELAY = 20;
const NUM_PLAYERS = 2; // 1 is broken DPTEST needs fixed
const QUESTION_TIME_SEC = 16;

let players_ = {};
let cb_, gameid_, state_, question_timer_, whosturn_;

function makePlayer() {
  return {bal: 0}
}

// ----------------------------------------------------------------------------
// Returns an element (key value) for path in the given gameid_. If path is
// not passed in, the game ref itself (root of the game) is returned.
// ----------------------------------------------------------------------------

function gameref(path) {
  return path == undefined ?
    db().ref(`/games/${gameid_}`) :
    db().ref(`/games/${gameid_}/${path}`);
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
  ref.on('value', async data => {
    const val = data.val();
    if (val < 0) {
      await tell('question_time_out', null);
      if (whosturn_ == name_)
        await judgeAnswers();
      return;
    }
    await tell('question_timer', val);
    if (whosturn_ == name_) {
      if (val == 6)
        msg("5 seconds left");
      question_timer_ = setTimeout(_ => {
        if (val >= 0) ref.set(val - 1);
      }, 1000);
    }
  });
}

let firstJudge_ = true;

async function judgeAnswers() {
  let ref = gameref('answerlist');
  const snap = await ref.once('value')
  const entries = snap.val() || [];

  const {t, a, q} = await value('active_square');
  const fullquestion = questions_[t][a / 200 - 1];
  const win = fullquestion.w;
  let doneent = false;
  let doneans = false;
  await msg("Time's up.");
  switch (entries.length) {
  case 0:
    await msg("No players have buzzed in.");
    await msg(`Sorry, correct answer was ${fullquestion.a[0]}`);
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
        await msg(`Adjusting player ${answer.name} balance by +${win}.`);
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
      await msg(`Adjusting player ${answer.name} balance by -${win}.`);
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
    await msg(`${nm}, you're in the lead with ${players_[nm].balance} dollars.`);
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
  ref.on('value', async data => {
    whosturn_ = data.val();
    if (!whosturn_)
      return;
    await tell('whosturn', whosturn_)
    if (name_ != whosturn_)
      return;
    if (cb_) {
      await dmsg(2, `Go ahead, your turn ${name_}`);
    }
    else
      doRoundConsole();
  });
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
//    await startQuestionTimer();
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
// no browser driving it.
// ----------------------------------------------------------------------------

async function start(cb) {
  if (!synth_)
    synth_ = window.speechSynthesis;
  try {
    cb_ = cb;
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
            i_quit_fn: signOut,
            buzzin_fn: buzzin};
  }
  catch (e) {
    console.error(e);
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
  ref.on('value', async data => {
    players_ = data.val() || {};
    await tell('players', players_);
  });
}

// ----------------------------------------------------------------------------
// Installs the listener for active_square updates. UI will display some type
// of pop up box off this event. Event data includes the topic, amount, and
// question, but not the answer.
//
// Changed to not pass up an empty value to UI since this confuses UI into
// thinking a square is actually active when it's just the engine getting
// itself initialized.
// ----------------------------------------------------------------------------

function onActiveSquare() {
  const ref = gameref('active_square');
  ref.on('value', async data => {
    const value = data.val();
    if (value) {
      await tell('active_square', value);
      await startQuestionTimer();
    }
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

function onReveal() {
  const ref = gameref('reveal');
  ref.on('value', data => {
    if (data.val())
      tell('reveal', data.val());
  });
}

// ----------------------------------------------------------------------------
// Returns a promise that never resolves. This is a poller of an output queue
// of messages for display and speaking. Stays in here for the life of the
// application.
// ----------------------------------------------------------------------------

function processQueue() {
  async function f() {
    if (queue_.length) {
      queue_working_ = true;
      const str = queue_.shift();
      if (str != null && str.length)
        await tts(str);
      await writeline(str).then(f);
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
    x.scrollTop = x.scrollHeight;
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

function tts(str) {
  function f(resolve) {
    if (!TTS_ENABLED) {
      if (resolve)
        resolve();
      else
        return null;
    }
    if (!TTS_ENABLED)
      return null;
    if (!synth_)
      throw 'speech synthesis is not initialized';
    if (!zira_) {
      zira_ = synth_.getVoices().filter(x => x.name.includes('Zira'))[0];
      if (!zira_)
        throw 'Could not load voice for speaker';
    }
    if (synth_.speaking) {
      w("speaking, will wait until finished");
      setTimeout(f, 1000);
    }
    else {
      let utterance = new SpeechSynthesisUtterance(str);
      utterance.pitch = 1;
          utterance.rate = 0.8;
      utterance.voice = zira_;
      synth_.speak(utterance);
      if (resolve)
        resolve();
    }
  }
  return new Promise((resolve) => { f(resolve); });
}
      
/*
async function tts(str) {
  if (!zira_) {
    zira_ = synth_.getVoices().filter(x => x.name.includes('Zira'))[0];
    console.debug("zira next..");
    console.debug(zira_);
  }
  if (synth_.speaking) {
    console.error("synth_ is already speaking");
    return;
  }
  let utterance = new SpeechSynthesisUtterance(str);
  utterance.pitch = 1;
  utterance.rate = 0.8;
  utterance.voice = zira_;
  console.debug("before speak..");
  console.debug(new Date());
  synth_.speak(utterance);
  console.debug("after speak..");
  console.debug(new Date());
}
*/

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
  const ref = db().ref().child('/players/abc');
  const snap = await ref.once('value');
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

// ----------------------------------------------------------------------------
// Specific to sub-paths under the current game. Use valueof for paths that
// are not under the current game, such as /enrolling.
// ----------------------------------------------------------------------------

async function value(path) {
  const ref = gameref(path);
  const ds = await ref.once('value');
  return ds.val();
}

// ----------------------------------------------------------------------------
// Specific to full paths, not limited to just game ref lookups. Use this
// function to look up values for anything not specific to a game, such
// as /enrolling.
// ----------------------------------------------------------------------------

async function valueof(path) {
  let a = db().ref(path);
  let snap = await a.once('value');
  return snap.val();
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

// DPTEST need to do validation on these args and throw something meaningful on each
// of topic wrong and amt wrong

function fullquestion(topic, amt) {
  if (typeof amt === 'string')
    amt = parseInt(amt);
  if (isNaN(amt))
    throw `amount is not a valid dollar value`;
  const col = questions_[topic];
  if (!col)
    throw `topic ${topic} is not valid`;
  return col[amt / 200 - 1];
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

  // --------------------------------------------------------------------------
  // Called to set the active square and close off this question from further
  // selection. Once selected, the question cannot be re-used and this
  // function assures us of that. Lives inside question() because question()
  // is the only valid place that setActiveSquare should be called.
  // --------------------------------------------------------------------------

  async function setActiveSquare(topic, amt, question) {
    const ref = gameref('active_square');
    await ref.set({t: topic, a: amt, q: question});
    const questionref = gameref('questions').child(topic).child(amt / 200 - 1);
    await questionref.child('open').set(false);
  }

  const x = fullquestion(topic, amt);
  if (!x)
    throw `invalid topic ${topic} or amt ${amt}`;
  if (!x.open)
    throw `question already played, no longer available ${topic} ${amt}`;
  if (gameid_ && whosturn_ == name_)
    await setActiveSquare(topic, amt, x.q);
  await msg("And the question is");
  await msg(x.q);
  return x.q;
}

async function revealTopics() {

  async function setReveal(ntopic, topic) {
    const ref = gameref('reveal');
    await ref.set([ntopic, topic]);
  }

  await dmsg(1, "Time to reveal today's topics.");
  const topics = Object.keys(questions_);
//  await tell('topic_reveal_starts', topics.length); not needed?
  await msg(`We have ${topics.length} topics for our game.`);
  for (let i = 0; i < topics.length; ++i) {
    await setReveal(i, topics[i]);
    await dmsg(1, `Topic is ${topics[i]}.`);
  }
//  await tell('topic_reveal_ends', topics.length); not needed?
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
  const ref = await db().ref().child(path);
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
  const user = await firebase.auth(app()).signInAnonymously();
  let ref = db().ref('/enrolling');
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
      console.error(e);
    }
  });
  if (!result.committed) {
    await display(`Name ${name_} already in use, please try another name`);
    return await readyToPlay(optName);
  }
  if (!enrollees) {
    await msg("Welcome " + name_ + "!");
    switch (enrolled_count) {
      case NUM_PLAYERS:
        await msg("You are the first contestant for a new enrolling game.");
        await msg(`Waiting for ${NUM_PLAYERS - enrolled_count + 1} more to join..`);
        break;
      case NUM_PLAYERS + 1:
        await msg("You are the second contestant for a new enrolling game.");
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
  await db().ref('/games').child(gameid_).onDisconnect().set(null);
  await gameref('players').set(x);
  await setQuestions(await loadQuestions());
  await msg("We now have a quorum of players!");
  await dmsg(2, "Game will start momentarily..");
  await revealTopics();
  await setWhosTurn(name_);
}

// ----------------------------------------------------------------------------
// I don't know that there is an order-dependence to these.
// ----------------------------------------------------------------------------

async function installGameListeners() {
  onActiveSquare();
  onMsg();
  onPlayers();
  onQuestions();
  onQuestionTimer();
  onReveal();
  onWhosTurn();
  setWhosTurn(null);
}

async function startQuestionTimer() {
  await gameref('question_timer').set(QUESTION_TIME_SEC);
}

async function isEnrolling() {
  let enrs = await valueof('/enrolling');
  return enrs && enrs.includes(`gameid-${gameid_}`);
}

// ----------------------------------------------------------------------------
// Erases the game from firebase. If the game is in the enrolling state, then
// the /enrolling is also deleted.
// ----------------------------------------------------------------------------

async function signOut() {
  alert("signOut");
  if (isEnrolling()) {
    let ref = db().ref('/enrolling');
    ref.set(null);
  }
  gameref().set(null);
  await app().auth().signOut();
  await msg(`${name_} has signed out, sorry but this game is over!`);
}

module.exports = {
  buzzin,
  onMsg,
  question,
  readyToPlay,
  signOut,
  start,
  test
}
